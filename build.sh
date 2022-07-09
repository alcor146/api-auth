start=`date +%s.%N`
docker build -t api-auth .
end=`date +%s.%N`

runtime = $end-$start
echo $runtime
