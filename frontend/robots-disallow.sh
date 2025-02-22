#!/bin/bash

echo "User-Agent: *" > robots.txt
echo "Disallow: /" >> robots.txt
mv robots.txt .next/standalone/public/robots.txt
