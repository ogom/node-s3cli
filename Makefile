REPORTER = dot
TESTS = test/unit/*.js

clean:
	rm -rf node_modules

npm:
	npm install

test: npm
	npm test

test-unit:
	@./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--ui bdd \
		$(TESTS)

test-spec:
	@./node_modules/.bin/mocha \
		--reporter spec \
		--ui bdd \
		$(TESTS)

.PHONY: clean npm test test-unit test-spec
