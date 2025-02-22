#!/bin/bash

while getopts e:h:a: flag
do
    case "${flag}" in
        e) env=${OPTARG};;
        h) host=${OPTARG};;
        a) apihost=${OPTARG};;
    esac
done

echo "NEXT_PUBLIC_ENV=$env" > .env
echo "NEXT_PUBLIC_HOST=$host" >> .env
echo "NEXT_PUBLIC_API_HOST=$apihost" >> .env
