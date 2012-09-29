#!/bin/bash

baseurl="../scroller/scroller"

cp index.html ${baseurl}/
cp bench.html ${baseurl}/
cp create_ver.bash ${baseurl}/
cp -r js/ ${baseurl}/
cp xml/xslt/* ${baseurl}/xml/xslt/
cp xml/demo.xml ${baseurl}/xml/
cp xml/demoindex.xml ${baseurl}/xml/index.xml
