build:
	@open http://localhost:3000/example/friday.html
	@gulp

doc:
	@ghp-import example -n -p

.PHONY: test
