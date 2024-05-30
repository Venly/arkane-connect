# Build NodeJs Action

## Description

The "Build NodeJs" Action automates the process of building Node.js projects. It includes setting up Node.js, caching node modules, executing build and test commands, and handling npm versioning and local caching.

## Inputs

| Input             | Description                              | Required | Default     |
| ----------------- | ---------------------------------------- | -------- | ----------- |
| `aws_region`      | AWS region for deployment                | No       | `eu-west-1` |
| `cache_folder`    | Optional cache folder                    | No       |             |
| `commands`        | Command to execute for build and test    | Yes      |             |
| `node_version`    | Version of node to use                   | No       | `16.x`      |
| `sonar_token`     | The SONAR_TOKEN                          | No       |             |
| `token`           | The VENLY_GITHUB_ACTIONS_TOKEN           | Yes      |             |

## Steps

1. **Branch to Build**
2. **Get NPM Version**
3. **Create NPM Cache Path**
4. **Cache Node Modules**
5. **Use Node.js**
6. **Install Dependencies if Cache Miss**
7. **Build & Test**
8. **Package Version to Git Tag**
9. **Locally Cache Build Files**
10. **Set Outputs**

## Usage

To use this action in your workflow, add the following step:

```yaml
- name: Build Node.js Project
  uses: ArkaneNetwork/venly-github-workflows/.github/actions/build_node@main
  with:
    aws_region: "<your-aws-region>"
    cache_folder: "<optional-cache-folder>"
    commands: "<build-and-test-commands>"
    node_version: "<node-version>"
    sonar_token: "<sonar-token>"
    token: "<github-actions-token>"
```
