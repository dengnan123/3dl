while read oldrev newrev ref ; do
    # old revision is blank - branch creation
    if [ "$oldrev" = "0000000000000000000000000000000000000000" ] || 
         # new revision is blank - branch deletion
         [ "$newrev" = "0000000000000000000000000000000000000000" ] ||
         # branch != master - pass through
         [ "$ref" != "refs/heads/master" ] ;
    then
        # create new or delete old branch
        # or force pushing to non-master branch
        continue;
    fi

    base=$(git merge-base $oldrev $newrev);
    if [ "$base" != "$oldrev" ] ; then
        # non fast forward merge
        echo "Force pushing of $ref is forbidden to master";
        exit 1;
    fi
done
exit 0;