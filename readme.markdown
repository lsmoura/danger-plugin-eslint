# danger-plugin-eslint

It grabs the generated json by eslint and publishes the reports.

## Usage

Install this Danger plugin:

```
yarn add --dev @lsmoura/danger-plugin-jest
```

By default, this package will assume you've set the filename as `eslint-result.json`, but you can use any path.

Add a step on your github action script to generate the linting output file:

```
  - name: linting
    continue-on-error: true
    run: yarn lint --output-file eslint-result.json --format json --no-color
```

You can check [danger.yml](blob/master/.github/workflows/danger.yml) for details.

# Author

Sergio Moura <[https://sergio.moura.ca](https://sergio.moura.ca)>
