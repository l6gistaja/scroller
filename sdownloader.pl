#!/usr/bin/perl

# configuration
$download_dir = "sdownloads/";
$file_prefix = "";
$fileextension = "";
$placeholder_delimiter = "_";
$dry_run = 0;
$allowed_fails = 10;

# cycle data
###REAL DATA###

# preparations
if(!$dry_run && $download_dir ne '' && !(-e $download_dir)) {
    system("mkdir ".$download_dir);
}
$url =~ s/:\}/:1\}/g;
@matches = $url =~ /(\{\d+:\d+\})/g;
for($j= $#levels; $j > -1; $j--) {
    if(!exists $levels[$j]->{placeholderlength}) {
        $placeholderstr = ''.$levels[$j]->{cbegin};
        $levels[$j]->{placeholderlength} = length($placeholderstr);
        if(exists $levels[$j]->{cend}) {
            $placeholderstr = ''.$levels[$j]->{cend};
            $levels[$j]->{placeholderlength} = length($placeholderstr);
        }
    }
}
#use Data::Dumper; print Dumper(@levels);

$fails = 0;
while(true) {
    
    $direction = 1;
    
    for($j= $#levels; $j > -1; $j--) {
    
        if (! exists $levels[$j]->{currentstep}) {
            $levels[$j]->{currentstep} = $levels[$j]->{cbegin};
        } else {
            $levels[$j]->{currentstep} = $levels[$j]->{currentstep}  + $direction * $levels[$j]->{cincrement};
        }
        $direction = 0;
        
        # if first level is out of boundaries, stop script
        if ( ($j == 0) &&
        (
            (exists $levels[$j]->{cend} && $levels[$j]->{currentstep} > $levels[$j]->{cend})
            || $levels[$j]->{currentstep} < $levels[$j]->{cbegin}
        )
        ) { exit; }
        
        # next cycle
        if (exists $levels[$j]->{cend} &&  $levels[$j]->{cend} < $levels[$j]->{currentstep}) {
            $direction = 1;
            $levels[$j]->{currentstep} = $levels[$j]->{cbegin};
        }
        
    }
    
    $currenturl = $url;
    foreach $placeholder (@matches) {
        @pointers = $placeholder =~ /\{(\d+):(\d+)\}/g;
        $value = sprintf("%0".$pointers[1]."d", $levels[$pointers[0]]->{currentstep});
        $currenturl =~ s/$placeholder/$value/g;
    }
    @filepath = split(/\//, $currenturl);
    $filename = $filepath[$#filepath];
    
    $movecommand = $download_dir.$file_prefix;
    @extpieces = split(/\./,$filename);
    $has_extension = $#extpieces > 0 ? 1 : 0;
    for($j=0; $j < $#levels + $has_extension; $j++) {
        $movecommand .= sprintf("%0".$levels[$j]->{placeholderlength}."d", $levels[$j]->{currentstep});
        if($j < $#levels) { $movecommand .= $placeholder_delimiter; }
    }
    if($has_extension) {
        $filename2 = '.'.$extpieces[$#extpieces];
    } else {
        $filename2 =~ s/[^_A-Z\d\.]/-/ig;
    }
    $movecommand .= $filename2.$fileextension;
    
    if(!$dry_run && !(-e $movecommand)) {
        system("wget ".$currenturl);
        if(!exists $levels[0]->{cend} && !(-e $filename)) {
            $fails++;
            if($allowed_fails < $fails) { exit; }
        } else {
            $fails = 0;
        }
    }
    
    $movecommand = "mv '".$filename."' ".$movecommand;
    if(!$dry_run && -e $filename) { system($movecommand);  }
    
    if($dry_run) {
        print "$currenturl\n";
        print "$movecommand\n";
    }
    
}