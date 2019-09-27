# Release

On **release branch**, run:

```bash
#set version to a new minor version (can also be major or patch)
npm version minor 

git push

git push --tags 
```

Merge release branch to master

Run in **master**:
```bash
npm install 

npm run build

npm publish
```

Backmerge master into develop 

Run in **develop**:
```bash
npm version preminor --preid=develop --git-tag-version=false

git push
```