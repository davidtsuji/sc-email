build:
	@npm install
	@./node_modules/.bin/bower install
	@./node_modules/.bin/grunt

clean:
	@rm -rf dist node_modules bower_components .tmp

release:
	@make clean
	@make build

.PHONY: build clean release