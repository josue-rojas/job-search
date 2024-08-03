#!/bin/bash

# Navigate to the directory containing your TypeScript script
workingDirectory=$(pwd)
cd $workingDirectory

# Run the TypeScript script using ts-node
npx ts-node ./server/scrape.ts
