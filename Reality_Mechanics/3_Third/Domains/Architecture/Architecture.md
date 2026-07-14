---

grounded: true
order: third
kind: term
ai_role: domain
condition_key: third.architecture
determination: pd.v3.pre-provenance-baseline
domain: architecture

conditions:
  places: "the built-domain branch where structural Atlas terms become readable as occupation, shelter, access, support, construction, documentation, and use."
  needs:
    targets:
      - third.branch
      - third.place-field
      - first.boundary
      - first.bearing
      - second.constraint
      - second.closure-scope
      - third.placed-participation
  holds:
    targets:
      - third.branch
      - third.place-field
      - first.boundary
      - first.bearing
      - second.constraint
      - second.closure-scope
      - third.placed-participation
    read: "[[Branch]], [[Place Field]], [[Boundary]], [[Bearing]], [[Constraint]], [[Closure Scope]], [[Placed Participation]]."
  pairs:
    targets: []
    read: "No lateral pair is required at this placement yet; this term currently reads as a branch or terminal read."
  traces:
    targets:
      - third.branch
      - third.place-field
      - first.boundary
      - first.bearing
      - second.constraint
      - second.closure-scope
      - third.placed-participation
      - third.technology-domain
  nests:
    targets:
      - third.place-field
      - third.making-field
      - third.knowledge-field
    read: "within [[Place Field]], [[Making Field]], and [[Knowledge Field]] as an organised domain branch. Its local reads are architectural terms, but their support remains retraceable through boundary, bearing, constraint, closure scope, and place."
  reads:
    targets: []
    read: "Architecture becomes readable where boundary, bearing, constraint, closure scope, and place organise built occupation, shelter, access, support, construction, documentation, and use."
  carries:
    targets:
      - third.architectural-boundary
      - third.architectural-carrying
      - third.architectural-constraint
      - third.architectural-documentation
      - third.architectural-resolution
      - third.architectural-visibility
      - third.load-bearing
      - third.documentation-gap
publish: true
status: stable
---
# Architecture

The built-domain branch where structural Atlas terms become readable as occupation, shelter, access, support, construction, documentation, and use.

Architecture is held by [[Branch]], [[Place Field]], [[Boundary]], [[Bearing]], [[Constraint]], [[Closure Scope]], [[Placed Participation]].

## Places

Architecture places the built-domain branch where structural Atlas terms become readable as occupation, shelter, access, support, construction, documentation, and use.

## Holds

Architecture is held by [[Branch]], [[Place Field]], [[Boundary]], [[Bearing]], [[Constraint]], [[Closure Scope]], [[Placed Participation]].

## Pairs

No lateral pair is required at this placement yet; this term currently reads as a branch or terminal read.

## Traces

- [[Branch]]
- [[Place Field]]
- [[Boundary]]
- [[Bearing]]
- [[Constraint]]
- [[Closure Scope]]
- [[Placed Participation]]

- [[Technology Domain]]
## Nests

Architecture nests within [[Place Field]], [[Making Field]], and [[Knowledge Field]] as an organised domain branch. Its local reads are architectural terms, but their support remains retraceable through boundary, bearing, constraint, closure scope, and placed participation.

## Reads

Architecture becomes readable where boundary, bearing, constraint, closure scope, and placed participation organise built occupation, shelter, access, support, construction, documentation, and use.

The dependency movement is:

First: [[Boundary]] and [[Bearing]] make located support possible.

Second: [[Constraint]] and [[Closure Scope]] make built conditions evaluable.

Third: [[Architecture]] places that structural read inside built occupation, shelter, access, and documentation.

Local applied reads:

- [[Documentation Gap]]

At the [[Translation Boundary]], [[Boundary]], [[Bearing]], [[Constraint]], [[Closure Scope]], [[Placed Participation]], and [[Visibility]] become terminal to this domain as [[Architectural Boundary]], [[Architectural Carrying]], [[Architectural Constraint]], [[Architectural Resolution]], [[Architectural Visibility]], [[Load-Bearing]], and [[Documentation Gap]].

## Carries

- [[Architectural Boundary]]
- [[Architectural Carrying]]
- [[Architectural Constraint]]
- [[Architectural Documentation]]
- [[Architectural Resolution]]
- [[Architectural Visibility]]
- [[Load-Bearing]]
- [[Documentation Gap]]
