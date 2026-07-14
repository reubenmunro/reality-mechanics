#!/usr/bin/env ruby

require "date"
require "digest"
require "fileutils"
require "json"
require "pathname"
require "yaml"

class TranslationFailure < StandardError; end

class CanonicalTranslation
  FORMAT_VERSION = 2
  PARTICIPATION_VERSION = 1

  attr_reader :graph, :files

  def initialize(repo_root:, atlas_root:, destination_root:)
    @repo_root = Pathname(repo_root).expand_path
    @atlas_root = Pathname(atlas_root).expand_path
    @destination_root = Pathname(destination_root).expand_path
    @files = atlas_files
  end

  def run(write: true)
    records = parse_source_once
    @graph = form_graph(records)
    outputs = translate(@graph)
    write_outputs(outputs) if write
    summary(outputs)
  end

  private

  def fail_translation(message)
    raise TranslationFailure, message
  end

  def atlas_files
    Dir.glob(@atlas_root.join("**", "*.md").to_s)
      .reject { |path| path.include?("/.obsidian/") }
      .map { |path| Pathname(path) }
      .sort_by(&:to_s)
  end

  def source_path(path)
    path.relative_path_from(@repo_root).to_s
  rescue ArgumentError
    path.relative_path_from(@atlas_root.parent).to_s
  end

  def source_hash
    digest = Digest::SHA256.new
    @files.each do |path|
      digest << source_path(path) << "\0" << path.binread << "\0"
    end
    "sha256:#{digest.hexdigest}"
  end

  def split_frontmatter(raw, path)
    match = raw.match(/\A---\n(.*?)\n---\n/m)
    fail_translation("Missing YAML frontmatter: #{source_path(path)}") unless match
    [match[1], raw[match.end(0)..] || ""]
  end

  def yaml_load(frontmatter, path)
    YAML.safe_load(frontmatter, permitted_classes: [Date], aliases: true) || {}
  rescue Psych::SyntaxError => error
    fail_translation("Invalid YAML in #{source_path(path)}: #{error.message}")
  end

  def parse_content(body, path)
    title_match = body.match(/^#\s+(.+?)\s*$/)
    fail_translation("Missing H1 title: #{source_path(path)}") unless title_match
    title = title_match[1].strip
    remainder = body[title_match.end(0)..].to_s.sub(/\A\n/, "")
    matches = remainder.enum_for(:scan, /^(\#{2,6})\s+(.+?)\s*$/).map { Regexp.last_match.dup }
    lead_end = matches.first&.begin(0) || remainder.length
    lead = remainder[0...lead_end].to_s.strip
    sections = matches.each_with_index.map do |match, index|
      content_start = match.end(0)
      content_end = matches[index + 1]&.begin(0) || remainder.length
      {
        "heading" => match[2].strip,
        "depth" => match[1].length,
        "markdown" => remainder[content_start...content_end].to_s.sub(/\A\n/, "").strip,
      }
    end
    [title, { "lead" => lead, "sections" => sections }]
  end

  def normalize_scalar(value)
    case value
    when Date then value.iso8601
    when Hash then value.to_h { |key, item| [key.to_s, normalize_scalar(item)] }
    when Array then value.map { |item| normalize_scalar(item) }
    else value
    end
  end

  def parse_source_once
    @files.map do |path|
      raw = path.binread.force_encoding("UTF-8")
      frontmatter, body = split_frontmatter(raw, path)
      data = normalize_scalar(yaml_load(frontmatter, path))
      title, content = parse_content(body, path)
      {
        path: source_path(path),
        data: data,
        title: title,
        content: content,
      }
    end
  end

  def unique_owner(records, key)
    owners = records.select { |record| record[:data].key?(key) }
    fail_translation("Expected exactly one #{key} declaration; found #{owners.length}") unless owners.length == 1
    owners.first
  end

  def normalize_atlas_schema(source)
    {
      "identityField" => source.fetch("identity_field"),
      "requiredFields" => source.fetch("required_fields"),
      "placement" => {
        "exactlyOneOf" => source.fetch("placement").fetch("exactly_one_of"),
        "orderValues" => source.fetch("placement").fetch("order_values"),
        "registerValues" => source.fetch("placement").fetch("register_values"),
      },
      "statuses" => source.fetch("status_values"),
      "structuralRadii" => source.fetch("structural_radii"),
      "relations" => source.fetch("relation_meanings").to_h { |key, meaning| [key, { "meaning" => meaning }] },
      "conditionRepresentation" => {
        "places" => source.fetch("condition_representation").fetch("places").tr("_", "-"),
        "relations" => source.fetch("condition_representation").fetch("relations").tr("_", "-"),
      },
      "targetAbsence" => {
        "mode" => source.fetch("target_absence").fetch("mode").tr("_", "-"),
        "readRequiredFor" => source.fetch("target_absence").fetch("read_required_for"),
      },
    }
  rescue KeyError => error
    fail_translation("Incomplete atlas_schema: #{error.message}")
  end

  def normalize_determinations(source)
    source.to_h do |id, record|
      normalized = {
        "proof" => record.fetch("proof"),
        "approvedOn" => record.fetch("approved_on").to_s,
        "constitutionalResponse" => record.fetch("constitutional_response"),
        "structuralRadius" => record.fetch("structural_radius"),
      }
      normalized["caveat"] = record["caveat"] if record.key?("caveat")
      [id, normalized]
    end
  rescue KeyError => error
    fail_translation("Incomplete determination record: #{error.message}")
  end

  def validate_source_record(record, schema, ids, determinations)
    data = record[:data]
    identity_field = schema.fetch("identityField")
    id = data[identity_field]
    fail_translation("Missing #{identity_field}: #{record[:path]}") unless id.is_a?(String) && !id.empty?
    fail_translation("Entry is not grounded: #{record[:path]}") unless data["grounded"] == true
    fail_translation("Entry publish is not true: #{record[:path]}") unless data["publish"] == true
    fail_translation("Missing kind: #{record[:path]}") unless data["kind"].is_a?(String) && !data["kind"].empty?
    fail_translation("Invalid status #{data["status"].inspect}: #{record[:path]}") unless schema.fetch("statuses").key?(data["status"])

    placements = schema.fetch("placement").fetch("exactlyOneOf")
    present = placements.select { |field| data.key?(field) }
    fail_translation("Placement must contain exactly one of #{placements.join(", ")}: #{record[:path]}") unless present.length == 1
    placement = present.first
    allowed = placement == "order" ? schema.dig("placement", "orderValues") : schema.dig("placement", "registerValues")
    fail_translation("Invalid #{placement} #{data[placement].inspect}: #{record[:path]}") unless allowed.include?(data[placement])

    determination = data["determination"]
    fail_translation("Missing determination: #{record[:path]}") unless determination.is_a?(String)
    fail_translation("Unresolved determination #{determination}: #{record[:path]}") unless determinations.key?(determination)
    fail_translation("Legacy top-level needs survives: #{record[:path]}") if data.key?("needs")

    conditions = data["conditions"]
    fail_translation("Missing conditions: #{record[:path]}") unless conditions.is_a?(Hash)
    relation_keys = schema.fetch("relations").keys
    expected_condition_keys = ["places", *relation_keys]
    fail_translation("Condition keys diverge in #{record[:path]}") unless conditions.keys == expected_condition_keys
    fail_translation("Missing authored Places read: #{record[:path]}") unless conditions["places"].is_a?(String) && !conditions["places"].empty?

    relation_keys.each do |relation|
      relation_read = conditions[relation]
      fail_translation("#{relation} is not a relation object: #{record[:path]}") unless relation_read.is_a?(Hash)
      fail_translation("#{relation}.targets missing: #{record[:path]}") unless relation_read["targets"].is_a?(Array)
      targets = relation_read["targets"]
      fail_translation("Duplicate #{relation} targets: #{record[:path]}") unless targets.uniq.length == targets.length
      targets.each do |target|
        fail_translation("Non-string #{relation} target: #{record[:path]}") unless target.is_a?(String)
        fail_translation("Unresolved #{relation} target #{target}: #{record[:path]}") unless ids.include?(target)
      end
      if targets.empty? && schema.dig("targetAbsence", "readRequiredFor").include?(relation)
        fail_translation("Empty #{relation} lacks authored read: #{record[:path]}") unless relation_read["read"].is_a?(String) && !relation_read["read"].empty?
      end
      unexpected = relation_read.keys - %w[targets read]
      fail_translation("Unexpected #{relation} fields #{unexpected.join(", ")}: #{record[:path]}") unless unexpected.empty?
    end
  end

  def form_graph(records)
    schema_owner = unique_owner(records, "atlas_schema")
    determination_owner = unique_owner(records, "determination_records")
    protocol_owner = unique_owner(records, "protocols")
    schema = normalize_atlas_schema(schema_owner[:data].fetch("atlas_schema"))
    determinations = normalize_determinations(determination_owner[:data].fetch("determination_records"))
    protocols = protocol_owner[:data].fetch("protocols")
    identity_field = schema.fetch("identityField")
    ids = records.map { |record| record[:data][identity_field] }
    fail_translation("Missing canonical identity") if ids.any?(&:nil?)
    duplicates = ids.group_by(&:itself).select { |_id, values| values.length > 1 }.keys
    fail_translation("Duplicate canonical IDs: #{duplicates.join(", ")}") unless duplicates.empty?
    id_set = ids.to_h { |id| [id, true] }

    records.each { |record| validate_source_record(record, schema, id_set, determinations) }
    protocols.each do |name, members|
      fail_translation("Protocol #{name} is empty") unless members.is_a?(Array) && !members.empty?
      fail_translation("Protocol #{name} has duplicate members") unless members.uniq.length == members.length
      members.each { |id| fail_translation("Protocol #{name} has unresolved member #{id}") unless id_set[id] }
    end

    entries = records.sort_by { |record| record[:data].fetch(identity_field) }.to_h do |record|
      data = record[:data]
      id = data.fetch(identity_field)
      entry = {
        "title" => record[:title],
        "sourcePath" => record[:path],
        "kind" => data.fetch("kind"),
        "status" => data.fetch("status"),
        "publish" => data.fetch("publish"),
        "determination" => data.fetch("determination"),
        "conditions" => data.fetch("conditions"),
        "content" => record[:content],
      }
      entry["aliases"] = data["aliases"] if data["aliases"].is_a?(Array) && !data["aliases"].empty?
      entry["version"] = data["version"] if data.key?("version")
      entry["order"] = data["order"] if data.key?("order")
      entry["register"] = data["register"] if data.key?("register")
      entry["atlasSchema"] = schema if record.equal?(schema_owner)
      entry["determinationRecords"] = determinations if record.equal?(determination_owner)
      entry["protocols"] = protocols if record.equal?(protocol_owner)
      [id, entry]
    end

    {
      "formatVersion" => FORMAT_VERSION,
      "sourceHash" => source_hash,
      "entries" => entries,
    }
  end

  def declaration(graph, key)
    owners = graph.fetch("entries").select { |_id, entry| entry.key?(key) }
    fail_translation("Generated graph has #{owners.length} #{key} owners") unless owners.length == 1
    owners.values.first.fetch(key)
  end

  def declaration_owner_id(graph, key)
    owners = graph.fetch("entries").select { |_id, entry| entry.key?(key) }
    fail_translation("Generated graph has #{owners.length} #{key} owners") unless owners.length == 1
    owners.keys.first
  end

  def body_from_entry(entry)
    chunks = ["# #{entry.fetch("title")}"]
    lead = entry.dig("content", "lead").to_s
    chunks << lead unless lead.empty?
    entry.dig("content", "sections").each do |section|
      block = "#{"#" * section.fetch("depth")} #{section.fetch("heading")}"
      markdown = section.fetch("markdown")
      block += "\n\n#{markdown}" unless markdown.empty?
      chunks << block
    end
    chunks.join("\n\n") + "\n"
  end

  def plain_text(markdown)
    markdown
      .gsub(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/) { Regexp.last_match(2) || Regexp.last_match(1) }
      .gsub(/```[\s\S]*?```/, " ")
      .gsub(/`([^`]+)`/, "\\1")
      .gsub(/^\#{1,6}\s+/, "")
      .gsub(/[*_~>#-]+/, " ")
      .gsub(/\s+/, " ")
      .strip
  end

  def slugify(value)
    value.downcase.unicode_normalize(:nfkd).gsub(/\p{Mn}/, "").gsub(/[^a-z0-9]+/, "-").gsub(/\A-+|-+\z/, "")
  end

  def compact_json(value)
    JSON.generate(value)
  end

  def pretty_json(value)
    JSON.pretty_generate(value) + "\n"
  end

  def search_projection(graph)
    graph.fetch("entries").map do |id, entry|
      body = body_from_entry(entry)
      {
        "id" => id,
        "title" => entry.fetch("title"),
        "order" => entry["order"],
        "register" => entry["register"],
        "kind" => entry.fetch("kind"),
        "status" => entry.fetch("status"),
        "determination" => entry.fetch("determination"),
        "conditions" => entry.fetch("conditions"),
        "text" => plain_text(body),
      }.compact
    end
  end

  def graph_schema(graph)
    atlas_schema = declaration(graph, "atlasSchema")
    relations = atlas_schema.fetch("relations").keys
    relation_properties = relations.to_h do |key|
      relation = {
        "type" => "object",
        "additionalProperties" => false,
        "required" => ["targets"],
        "properties" => {
          "targets" => { "type" => "array", "items" => { "type" => "string" }, "uniqueItems" => true },
          "read" => { "type" => "string", "minLength" => 1 },
        },
      }
      if atlas_schema.dig("targetAbsence", "readRequiredFor").include?(key)
        relation["allOf"] = [{
          "if" => { "properties" => { "targets" => { "maxItems" => 0 } } },
          "then" => { "required" => ["read"] },
        }]
      end
      [key, relation]
    end
    entry_properties = {
      "title" => { "type" => "string", "minLength" => 1 },
      "sourcePath" => { "type" => "string", "minLength" => 1 },
      "kind" => { "type" => "string", "minLength" => 1 },
      "status" => { "enum" => atlas_schema.fetch("statuses").keys },
      "publish" => { "const" => true },
      "determination" => { "type" => "string", "minLength" => 1 },
      "conditions" => { "$ref" => "#/$defs/conditions" },
      "content" => {
        "type" => "object",
        "additionalProperties" => false,
        "required" => %w[lead sections],
        "properties" => {
          "lead" => { "type" => "string" },
          "sections" => {
            "type" => "array",
            "items" => {
              "type" => "object",
              "additionalProperties" => false,
              "required" => %w[heading depth markdown],
              "properties" => {
                "heading" => { "type" => "string", "minLength" => 1 },
                "depth" => { "type" => "integer", "minimum" => 2, "maximum" => 6 },
                "markdown" => { "type" => "string" },
              },
            },
          },
        },
      },
      "aliases" => { "type" => "array", "items" => { "type" => "string" }, "minItems" => 1 },
      "version" => {},
      "order" => { "enum" => atlas_schema.dig("placement", "orderValues") },
      "register" => { "enum" => atlas_schema.dig("placement", "registerValues") },
      "atlasSchema" => { "type" => "object" },
      "determinationRecords" => { "type" => "object" },
      "protocols" => { "type" => "object" },
    }
    {
      "$schema" => "https://json-schema.org/draft/2020-12/schema",
      "title" => "Generated Reality Mechanics Canonical Graph Schema",
      "description" => "Disposable validation schema translated from #{declaration_owner_id(graph, "atlasSchema")}.",
      "type" => "object",
      "additionalProperties" => false,
      "required" => %w[formatVersion sourceHash entries],
      "properties" => {
        "formatVersion" => { "const" => FORMAT_VERSION },
        "sourceHash" => { "type" => "string", "pattern" => "^sha256:[a-f0-9]{64}$" },
        "entries" => {
          "type" => "object",
          "minProperties" => 1,
          "additionalProperties" => { "$ref" => "#/$defs/entry" },
        },
      },
      "$defs" => {
        "entry" => {
          "type" => "object",
          "additionalProperties" => false,
          "required" => %w[title sourcePath kind status publish determination conditions content],
          "properties" => entry_properties,
          "oneOf" => [
            { "required" => ["order"], "not" => { "required" => ["register"] } },
            { "required" => ["register"], "not" => { "required" => ["order"] } },
          ],
        },
        "conditions" => {
          "type" => "object",
          "additionalProperties" => false,
          "required" => ["places", *relations],
          "properties" => { "places" => { "type" => "string", "minLength" => 1 } }.merge(relation_properties),
        },
      },
    }
  end

  def sql(value)
    return "NULL" if value.nil?
    return value.to_s if value.is_a?(Numeric)
    "'#{value.to_s.gsub("'", "''")}'"
  end

  def d1_schema
    <<~SQL
      -- Generated from the canonical Atlas. Delete and regenerate; do not edit.
      PRAGMA foreign_keys = OFF;
      DROP TABLE IF EXISTS entries_fts;
      DROP TABLE IF EXISTS atlas_protocol_members;
      DROP TABLE IF EXISTS atlas_determinations;
      DROP TABLE IF EXISTS atlas_metadata;
      DROP TABLE IF EXISTS atlas_registers;
      DROP TABLE IF EXISTS entries;
      CREATE TABLE entries (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        source_path TEXT NOT NULL,
        public_url TEXT NOT NULL,
        content TEXT NOT NULL,
        plain_text TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        status TEXT NOT NULL,
        grounded INTEGER NOT NULL CHECK (grounded = 1),
        entry_order TEXT,
        entry_register TEXT,
        entry_type TEXT NOT NULL,
        branch TEXT,
        aliases TEXT NOT NULL,
        tags TEXT NOT NULL,
        related TEXT NOT NULL,
        structure TEXT NOT NULL,
        conditions TEXT NOT NULL,
        headings TEXT NOT NULL,
        determination TEXT NOT NULL,
        word_count INTEGER NOT NULL,
        created TEXT,
        updated TEXT,
        CHECK ((entry_order IS NULL) <> (entry_register IS NULL))
      );
      CREATE VIRTUAL TABLE entries_fts USING fts5(id, title, plain_text);
      CREATE TABLE atlas_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE atlas_determinations (
        id TEXT PRIMARY KEY,
        proof TEXT NOT NULL,
        approved_on TEXT NOT NULL,
        constitutional_response TEXT NOT NULL,
        structural_radius TEXT NOT NULL,
        caveat TEXT
      );
      CREATE TABLE atlas_protocol_members (
        protocol TEXT NOT NULL,
        ordinal INTEGER NOT NULL,
        entry_id TEXT NOT NULL,
        PRIMARY KEY (protocol, ordinal),
        UNIQUE (protocol, entry_id),
        FOREIGN KEY (entry_id) REFERENCES entries(id)
      );
      CREATE INDEX entries_order_idx ON entries(entry_order);
      CREATE INDEX entries_register_idx ON entries(entry_register);
      CREATE INDEX entries_determination_idx ON entries(determination);
      PRAGMA foreign_keys = ON;
    SQL
  end

  def d1_sync(graph)
    schema = declaration(graph, "atlasSchema")
    relation_keys = schema.fetch("relations").keys
    lines = [
      "-- Generated from one Canonical Graph. Delete and regenerate; do not edit.",
      "DELETE FROM atlas_protocol_members;",
      "DELETE FROM atlas_determinations;",
      "DELETE FROM atlas_metadata;",
      "DELETE FROM entries_fts;",
      "DELETE FROM entries;",
      "INSERT INTO atlas_metadata (key,value) VALUES ('source_hash',#{sql(graph.fetch("sourceHash"))});",
      "INSERT INTO atlas_metadata (key,value) VALUES ('entry_count',#{sql(graph.fetch("entries").length.to_s)});",
      "INSERT INTO atlas_metadata (key,value) VALUES ('atlas_schema',#{sql(compact_json(schema))});",
    ]

    graph.fetch("entries").each do |id, entry|
      body = body_from_entry(entry)
      text = plain_text(body)
      structure = relation_keys.to_h { |key| [key, entry.dig("conditions", key, "targets")] }
      related = structure.values.flatten.uniq.sort
      headings = entry.dig("content", "sections").map do |section|
        { "depth" => section.fetch("depth"), "text" => section.fetch("heading"), "anchor" => slugify(section.fetch("heading")) }
      end
      values = [
        id,
        entry.fetch("title"),
        slugify(entry.fetch("title")),
        entry.fetch("sourcePath"),
        "https://realitymechanics.nz/field##{id}",
        body,
        text,
        text.split(/\s+/).first(28).join(" "),
        entry.fetch("status"),
        1,
        entry["order"],
        entry["register"],
        entry.fetch("kind"),
        nil,
        compact_json(entry.fetch("aliases", [])),
        "[]",
        compact_json(related),
        compact_json(structure),
        compact_json(entry.fetch("conditions")),
        compact_json(headings),
        entry.fetch("determination"),
        text.split(/\s+/).reject(&:empty?).length,
        nil,
        nil,
      ]
      columns = %w[id title slug source_path public_url content plain_text excerpt status grounded entry_order entry_register entry_type branch aliases tags related structure conditions headings determination word_count created updated]
      lines << "INSERT INTO entries (#{columns.join(",")}) VALUES (#{values.map { |value| sql(value) }.join(",")});"
      lines << "INSERT INTO entries_fts (id,title,plain_text) VALUES (#{sql(id)},#{sql(entry.fetch("title"))},#{sql(text)});"
    end

    declaration(graph, "determinationRecords").each do |id, record|
      lines << "INSERT INTO atlas_determinations (id,proof,approved_on,constitutional_response,structural_radius,caveat) VALUES (#{[
        id,
        record.fetch("proof"),
        record.fetch("approvedOn"),
        record.fetch("constitutionalResponse"),
        record.fetch("structuralRadius"),
        record["caveat"],
      ].map { |value| sql(value) }.join(",")});"
    end
    declaration(graph, "protocols").each do |name, members|
      members.each_with_index do |entry_id, ordinal|
        lines << "INSERT INTO atlas_protocol_members (protocol,ordinal,entry_id) VALUES (#{sql(name)},#{ordinal},#{sql(entry_id)});"
      end
    end
    lines.join("\n") + "\n"
  end

  def generated_module(graph)
    schema = declaration(graph, "atlasSchema")
    protocols = declaration(graph, "protocols")
    determinations = declaration(graph, "determinationRecords")
    theory = graph.fetch("entries").select { |_id, entry| entry["kind"] == "theory" }
    fail_translation("Expected exactly one Theory entry; found #{theory.length}") unless theory.length == 1
    entry_index = graph.fetch("entries").to_h do |id, entry|
      [id, {
        "title" => entry.fetch("title"),
        "sourcePath" => entry.fetch("sourcePath"),
        "determination" => entry.fetch("determination"),
        "order" => entry["order"],
        "register" => entry["register"],
      }.compact]
    end
    <<~JS
      // Generated from the canonical Atlas. Delete and regenerate; do not edit.
      export const CANONICAL_SOURCE_HASH = #{compact_json(graph.fetch("sourceHash"))};
      export const CANONICAL_ENTRY_COUNT = #{graph.fetch("entries").length};
      export const ATLAS_SCHEMA = Object.freeze(#{compact_json(schema)});
      export const RELATION_KEYS = Object.freeze(#{compact_json(schema.fetch("relations").keys)});
      export const ORDER_VALUES = Object.freeze(#{compact_json(schema.dig("placement", "orderValues"))});
      export const REGISTER_VALUES = Object.freeze(#{compact_json(schema.dig("placement", "registerValues"))});
      export const DETERMINATION_RECORDS = Object.freeze(#{compact_json(determinations)});
      export const PROTOCOLS = Object.freeze(#{compact_json(protocols)});
      export const AI_ENTRY_PROTOCOL = Object.freeze(PROTOCOLS["ai-entry"] || []);
      export const CANONICAL_ENTRY_IDS = Object.freeze(#{compact_json(graph.fetch("entries").keys)});
      export const CANONICAL_ENTRY_INDEX = Object.freeze(#{compact_json(entry_index)});
      export const PUBLIC_THEORY_ENTRY = Object.freeze(#{compact_json(theory.values.first)});
    JS
  end

  def generated_documentation(graph)
    schema = declaration(graph, "atlasSchema")
    lines = [
      "# Atlas Source Format",
      "",
      "> Generated from `#{declaration_owner_id(graph, "atlasSchema")}`. Do not edit this file.",
      "",
      "Source hash: `#{graph.fetch("sourceHash")}`",
      "",
      "## Required Logical Fields",
      "",
      *schema.fetch("requiredFields").map { |field| "- `#{field}`" },
      "",
      "## Placement",
      "",
      "Exactly one of `#{schema.dig("placement", "exactlyOneOf").join("` or `")}`.",
      "",
      "Order values: #{schema.dig("placement", "orderValues").map { |value| "`#{value}`" }.join(", ")}.",
      "",
      "Register values: #{schema.dig("placement", "registerValues").map { |value| "`#{value}`" }.join(", ")}.",
      "",
      "## Status",
      "",
      *schema.fetch("statuses").map { |key, meaning| "- `#{key}`: #{meaning}" },
      "",
      "## Relations",
      "",
      *schema.fetch("relations").map { |key, value| "- `#{key}`: #{value.fetch("meaning")}" },
      "",
      "Every relation contains an explicit `targets` array. Empty #{schema.dig("targetAbsence", "readRequiredFor").map { |value| "`#{value}`" }.join(" and ")} relations require an authored read.",
      "",
    ]
    lines.join("\n")
  end

  def translate(graph)
    outputs = {}
    base = ".atlas-publisher/generated"
    outputs["#{base}/canonical-graph.json"] = pretty_json(graph)
    outputs["#{base}/canonical-graph.schema.json"] = pretty_json(graph_schema(graph))
    outputs["#{base}/atlas-d1-schema.sql"] = d1_schema
    outputs["#{base}/atlas-d1-sync.sql"] = d1_sync(graph)

    outputs["#{base}/participation/search-index.json"] = pretty_json({
      "sourceHash" => graph.fetch("sourceHash"),
      "entries" => search_projection(graph),
    })
    outputs["#{base}/participation/mcp-protocol.json"] = pretty_json({
      "sourceHash" => graph.fetch("sourceHash"),
      "protocols" => declaration(graph, "protocols"),
    })
    outputs["#{base}/participation/atlas-source-format.md"] = generated_documentation(graph)
    outputs["#{base}/canonical-participation.mjs"] = generated_module(graph)
    outputs["reality-mechanics-mcp/generated/canonical-participation.mjs"] = generated_module(graph)
    outputs["docs/generated/atlas-source-format.md"] = generated_documentation(graph)

    outputs["#{base}/ai/current/index.json"] = pretty_json({
      "formatVersion" => PARTICIPATION_VERSION,
      "sourceHash" => graph.fetch("sourceHash"),
      "entryCount" => graph.fetch("entries").length,
      "entryIds" => graph.fetch("entries").keys,
      "protocols" => declaration(graph, "protocols"),
    })
    graph.fetch("entries").each do |id, entry|
      outputs["#{base}/ai/current/entries/#{id}.json"] = pretty_json(entry.merge("id" => id))
    end

    outputs
  end

  def write_outputs(outputs)
    generated_roots = [
      @destination_root.join(".atlas-publisher", "generated"),
      @destination_root.join("reality-mechanics-mcp", "generated"),
      @destination_root.join("docs", "generated"),
    ]
    generated_roots.each { |path| FileUtils.rm_rf(path) }
    outputs.sort.each do |relative_path, bytes|
      path = @destination_root.join(relative_path)
      FileUtils.mkdir_p(path.dirname)
      path.binwrite(bytes)
    end
  end

  def summary(outputs)
    {
      "sourceHash" => @graph.fetch("sourceHash"),
      "entryCount" => @graph.fetch("entries").length,
      "orderCount" => @graph.fetch("entries").count { |_id, entry| entry.key?("order") },
      "registerCount" => @graph.fetch("entries").count { |_id, entry| entry.key?("register") },
      "relationCount" => @graph.fetch("entries").sum do |_id, entry|
        declaration(@graph, "atlasSchema").fetch("relations").keys.sum { |key| entry.dig("conditions", key, "targets").length }
      end,
      "protocols" => declaration(@graph, "protocols"),
      "outputCount" => outputs.length,
      "outputBytes" => outputs.values.sum(&:bytesize),
    }
  end
end

repo_root = Pathname(__dir__).parent.expand_path
atlas_root = repo_root.join("Reality_Mechanics")
destination_root = repo_root
write = true

ARGV.each do |argument|
  case argument
  when "--verify-only" then write = false
  when /\A--atlas-root=(.+)\z/ then atlas_root = Pathname(Regexp.last_match(1)).expand_path
  when /\A--output-root=(.+)\z/ then destination_root = Pathname(Regexp.last_match(1)).expand_path
  else abort("Unknown argument: #{argument}")
  end
end

begin
  translation = CanonicalTranslation.new(repo_root: repo_root, atlas_root: atlas_root, destination_root: destination_root)
  puts JSON.pretty_generate(translation.run(write: write))
rescue TranslationFailure, KeyError => error
  warn("Canonical Translation stopped: #{error.message}")
  exit 1
end
