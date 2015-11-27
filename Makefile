build:
	@open http://localhost:3000/example/index.html
	@gulp

doc:
	@ghp-import example -n -p

.PHONY: test
