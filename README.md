# Limon

## What is Limon

Limon is a boilerplate template to aid in rapid product development. I had a few
goals in mind while creating Limon.

1. Rapid product development and deployment
2. Security best practice
3. Good simple software design
4. Mobile/Design first with accessibility and localization
5. Good documentation

### Rapid Product Development and Deployment

Rapid development can be subjective but one of my goals with Limon was to keep a
reference implementation that was simple and modular. I also tend to find myself
spending more time fiddling with infrastructure than I would like. I wanted to
minimize the time spent fiddling with knobs and config for infra and maximize
time spend building product. For this reason Limon will be using Deno Deploy
which removes build steps and deploys Typescript to the edge.
