describe("RAML.Inspector.Method", function() {
  var method;

  parseRAML(createRAML(
    'title: MyApi',
    'baseUri: http://myapi.com',
    'securitySchemes:',
    '  - basic:',
    '      type: Basic Authentication',
    '  - oauth_2:',
    '      type: OAuth 2.0',
    '      settings:',
    '        accessTokenUri: http://example.com',
    '        authorizationUri: http://example.com',
    '/resource:',
    '  description: The first resource',
    '  get:',
    '    headers:',
    '      example:',
    '      x-parameterized-{*}:',
    '    securedBy: [null, basic, oauth_2: { scopes: [ comments ] } ]',
    '  post:',
    '    securedBy: [basic, oauth_2: { scopes: [ comments ] } ]',
    '/another/resource:',
    '  get:'
  ));

  describe("creation", function() {
    describe("by default", function() {
      beforeEach(function() {
        method = RAML.Inspector.Method.create(this.api.resources[0].methods[0], this.api.securitySchemes);
        securitySchemes = method.securitySchemes();
      });

      it("includes header without parameters as headers.plain", function() {
        expect(method.headers.plain['example']).toBeDefined()
        expect(method.headers.plain['x-parameterized-{*}']).not.toBeDefined()
      });

      it("includes parameterized headers as headers.parameterized", function() {
        expect(method.headers.parameterized['x-parameterized-{*}']).toBeDefined()
        expect(method.headers.parameterized['example']).not.toBeDefined()
      });
    });
  });

  describe("retrieving security scheme definitions for a method", function() {
    var securitySchemes;

    describe("by default", function() {
      beforeEach(function() {
        method = RAML.Inspector.Method.create(this.api.resources[0].methods[0], this.api.securitySchemes);
        securitySchemes = method.securitySchemes();
      });

      it("returns an object of scheme definitions", function() {
        expect(securitySchemes['basic']).toBeDefined()
      });

      it("filters null security scheme", function() {
        expect(securitySchemes['null']).toBeUndefined()
      });

      it("filters parameterized security schemes", function() {
        expect(securitySchemes['oauth_2']).toBeUndefined()
      });
    });

    describe("with no security schemes", function() {
      beforeEach(function() {
        method = RAML.Inspector.Method.create(this.api.resources[1].methods[0], this.api.securitySchemes);
        securitySchemes = method.securitySchemes();
      });

      it("returns an empty object when there are no security schemes", function() {
        expect(securitySchemes).toBeDefined();
      });
    });
  });

  describe("querying if a method allows anonymous access", function() {
    describe("with a null security scheme", function() {
      beforeEach(function() {
        method = RAML.Inspector.Method.create(this.api.resources[0].methods[0], this.api.securitySchemes);
      });

      it("marks the method as allowing anonymous access", function() {
        expect(method.allowsAnonymousAccess()).toBe(true);
      });
    });

    describe("with a non null security scheme", function() {
      beforeEach(function() {
        method = RAML.Inspector.Method.create(this.api.resources[0].methods[1], this.api.securitySchemes);
      });

      it("marks the method as not allowing anonymous access", function() {
        expect(method.allowsAnonymousAccess()).toBe(false);
      });
    });

    describe("with no security schemes", function() {
      beforeEach(function() {
        method = RAML.Inspector.Method.create(this.api.resources[1].methods[0], this.api.securitySchemes);
      });

      it("marks the method as allowing anonymous access", function() {
        expect(method.allowsAnonymousAccess()).toBe(true);
      });
    });
  });
})
