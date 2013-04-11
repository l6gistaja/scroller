#!/bin/bash

backup_directory=scrollerdata
rm -rf ${backup_directory}
mkdir ${backup_directory}
cp xml/*.xml ${backup_directory}
rm ${backup_directory}/demo.xml
rm ${backup_directory}/demoindex.xml
tar czvf ${backup_directory}`date +%Y%m%d%H%M%S`.tgz ${backup_directory}
rm -rf ${backup_directory}
