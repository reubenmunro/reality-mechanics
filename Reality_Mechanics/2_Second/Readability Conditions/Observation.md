---

grounded: true
order: second
kind: term
ai_role: term
condition_key: second.observation
determination: pd.2026-07-18.calibration-revision-set

conditions:
  places: "participated readability held in evaluation."
  needs:
    targets:
      - second.cognitive-participation
      - second.visibility
      - first.attend
      - second.evaluation
  holds:
    targets:
      - second.cognitive-participation
      - second.visibility
      - first.attend
      - second.evaluation
    read: "[[Cognitive Participation]], [[Visibility]], [[Attend]], and [[Evaluation]]. Readable difference must be participated in, presented enough to evaluate, and attended before observation can be named."
  pairs:
    targets:
      - second.visibility
    read: "[[Visibility]]. Visibility makes presented distinction readable; Observation takes that visible read into evaluation."
  traces:
    targets:
      - second.cognitive-participation
      - second.visibility
      - first.attend
      - second.evaluation
      - second.apparent-bearing
  nests:
    targets: []
    read: "where visible distinction is attended and evaluated rather than merely available."
  reads:
    targets: []
    read: "where a visible condition is being actively evaluated — where what is readable is attended and read rather than merely available to be read."
  carries:
    targets:
      - second.recognition-read
      - second.pattern
      - higher.higher-recognition
      - practice.calibration
publish: true
status: stable
---
# Observation

Participated readability held in evaluation.

Observation is held by [[Cognitive Participation]], [[Visibility]], [[Attend]], and [[Evaluation]]. Readable difference must be participated in, presented enough to evaluate, and attended before observation can be named.

Observation can occur before recognition. A condition may be observed as difference, signal, movement, pressure, or change before it is recognised as this. Observation does not determine what is observed; it names the condition through which participated readability becomes evaluable.

## Places

Observation places participated readability held in local evaluation.

## Holds

Observation is held by [[Cognitive Participation]], [[Visibility]], [[Attend]], and [[Evaluation]]. Readable difference must be participated in, presented enough to evaluate, and attended before observation can be named.

## Pairs

Observation pairs with [[Visibility]]. Visibility makes presented distinction readable; Observation takes that visible read into evaluation.

## Traces

- [[Visibility]]
- [[Cognitive Participation]]
- [[Attend]]
- [[Evaluation]]
- [[Apparent Bearing]]

## Nests

Observation nests where visible distinction is attended and evaluated rather than merely available.

## Reads

Observation becomes recognisable where a readable condition is being actively evaluated — where what is readable is participated in and attended rather than merely available to be read.

## Carries


- [[Recognition Read|Recognition]]
- [[Pattern]]
- [[Higher Recognition]]
- [[Calibration]]
