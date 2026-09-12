IMAGE_NAME = iamuzorr/yaatt
TEST_DIR   = $(PWD)/tests
SCHEMA_OUT = ./schema.json
PUBLISH_VERSION = $(shell date '+%Y%m%d%H%M%S')

# Default goal (show help when running just `make`)
.DEFAULT_GOAL := help

.PHONY: help build copy_schema generate run dev

## Show available commands
help:
	@echo ""
	@echo ">>> YAATT <<<"
	@echo ""
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## ' Makefile | sed 's/:.*##/: /' | column -t -s ':'
	@echo ""

## Build the Docker image
build: ## Build the Docker image
	docker build -t $(IMAGE_NAME) .

## Copy the test schema file from the container into the host
copy_schema: ## Copy schema.json from the Docker image
	YATTCID=$$(docker create $(IMAGE_NAME)); \
	docker cp $$YATTCID:/app/src/schema.json $(SCHEMA_OUT); \
	docker rm $$YATTCID

## Generate a new test file into ./tests
generate: ## Generate a new JSON test file
	docker run --rm -v $(TEST_DIR):/app/tests -t $(IMAGE_NAME) bun run generate

## Run all test files
run: ## Run all test files in ./tests
	docker run --rm -v $(TEST_DIR):/app/tests -t $(IMAGE_NAME) bun run start $(FILE)

## Run dev mode (auto-runs tests on file change)
dev: ## Run dev mode (watcher)
	docker run --rm -v $(TEST_DIR):/app/tests --env-file $(PWD)/.env -t $(IMAGE_NAME) bun run dev $(FILE)

## Runs unit test
test: ## Runs unit test
	docker run --rm -t $(IMAGE_NAME) bun run test

## Publishes image to docker
publish: build test ## Publishes image to docker
	docker build -t $(IMAGE_NAME):$(PUBLISH_VERSION) .
	docker push $(IMAGE_NAME):$(PUBLISH_VERSION)
	docker tag $(IMAGE_NAME):$(PUBLISH_VERSION) $(IMAGE_NAME):latest
	docker push $(IMAGE_NAME):latest