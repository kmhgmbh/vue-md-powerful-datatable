# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.13.0] - 2018-01-30
### Added
- watcher for data property in order to update table on data change

### Fixed
- Fix wrong page calculation if rows are not divisible by 10
  (f.e. 26 led to 2 pages instead of 3)
