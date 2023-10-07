# Api Reusability

Contents:

- [Summary](#summary)
  - [Issue](#issue)
  - [Considerations](#considerations)
  - [Decision](#decision)
  - [Status](#status)

## Summary

I we like to keep repetitive copy pasta to a minimal. CRUD operations will be
needed for all persisted data and are typically copy and pasted with a bit of
variation for different entities. I would like to establish a pattern that would
allow me to compose service and controller functionality as needed. I would
prefer for it to be simple and flexible and reusable, potentially with other
frameworks even.

### Issue

- I could potentially follow a typical inheritance pattern and create a class to
  extended it where it is needed. Js doesn't allow you to extend multiple
  classes. This method result in a bit of class explosion, its a bit more
  ridged.
- I could create a system of functions and use them disparately while building a
  service/controller. I believe it would be more explicit and potentially more
  simple.
- I could compose objects in a traditional js mixin style. This method would
  solve the issue but in practice it looks a bit messy.
- I could use typescript mixins with classes to compose a single class that
  would have the desired functionality.
- I will probably use a schema validation tool such as Joi or Zod to validate
  schema, produce meaningful exceptions, and enforce strict contracts.

### Considerations

- solid typing
- strict contracts, guaranteed signatures
- follow 3-layer SOA approach making sure to separate concerns.
  - Layer 1 (Data)
    - solid schema
    - flexible
  - Layer 2 (Service)
    - sanitizes inputs/outputs
    - handles business logic
    - transport agnostic
    - properly handle exceptions
  - Layer 3 (Controller)
    - handles transport concerns
    - orchestrates between services
    - properly handle transport specific exceptions

### Decision

I have landed on a series of generic
[typescript mixins](https://www.typescriptlang.org/docs/handbook/mixins.html),
using factory functions to compose the more complex mixins I can keep abstract
while maintaining solid typing throughout. I can use this method to create small
bits of functionality and used these mixins to compose classes that will solve
all of my issues. I will uze Zod for schema validation as it is quite feature
rich with solid typescript support.

### Status

Decided. Open to considering to new capabilities as they come up.
