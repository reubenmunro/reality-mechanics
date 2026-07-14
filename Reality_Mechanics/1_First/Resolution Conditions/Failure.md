---

grounded: true
order: first
kind: term
ai_role: term
condition_key: first.failure
determination: pd.v3.pre-provenance-baseline

conditions:
  places: "resolution where bearing cannot remain supportable at the current scope"
  needs:
    targets:
      - first.resolution
      - first.bearing
  holds:
    targets:
      - first.resolution
      - first.bearing
    read: "[[Resolution]] and [[Bearing]] — bearing must be present and determined before its loss of support can be read as failure"
  pairs:
    targets:
      - first.resolution
    read: "Asymmetry carries downward. Failure names a specific mode of [[Resolution]] — where bearing cannot remain supportable at the current scope. It is downstream of Resolution and Bearing without a lateral co-condition."
  traces:
    targets:
      - first.resolution
      - first.bearing
  nests:
    targets: []
    read: "under first-order resolution — absence, repair, harm, or disorder may follow but failure names the loss of supportable bearing"
  reads:
    targets: []
    read: "where bearing resolves as loss of support, collapse, break, or inability to continue under the strain it bears"
  carries:
    targets: []
    read: "No demonstrated downstream carry is currently determined."
publish: true
status: stable
---
# Failure

Resolution where bearing cannot remain supportable at the current scope.

Failure is held by [[Resolution]] and [[Bearing]]. Bearing must be present and determined before its loss of support can be read as failure.

## Places

Failure places resolution where bearing cannot remain supportable at the current scope.

## Holds

Failure is held by [[Resolution]] and [[Bearing]]. Bearing must be present and determined before its loss of support can be read as failure.

## Pairs

Asymmetry carries downward. Failure names [[Resolution]] where bearing cannot remain supportable: a specific mode of Resolution, not a juncture requiring co-presence. Its structural place is held by Resolution and Bearing.

## Traces

- [[Resolution]]
- [[Bearing]]

## Nests

Failure nests under first-order resolution. Absence, repair, harm, or disorder may follow, but failure itself names the loss of supportable bearing.

## Reads

Failure becomes recognisable where bearing resolves as loss of support, collapse, break, or inability to continue under the strain it bears.

## Carries


