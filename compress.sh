echo "init..."

# CSS
echo "/*Bootstrap Components 3.1 - Created By ZombieJ*/" > tmp.css
for file in src/*/*.css
do
	cat $file >> tmp.css
done

echo "export css...done"

# CSS MIN
cat tmp.css | tr -d '\r\n' | tr -d '\t' > tmp.min.css
echo "export css.min...done"

# JS
echo "/*Bootstrap Components 3.1 - Created By ZombieJ*/" > tmp.js
cat src/common/bootstrap-common.js >> tmp.js
for file in $(ls src/*/*.js | grep -v "src/common/bootstrap-common.js")
do
	cat $file >> tmp.js
done
echo "export js...done"

cp tmp.js tmp.min.js
echo "export js.min...done"

mv tmp.css bootstrap-components/css/bootstrap-components.css
mv tmp.min.css bootstrap-components/css/bootstrap-components.min.css
mv tmp.js bootstrap-components/js/bootstrap-components.js
mv tmp.min.js bootstrap-components/js/bootstrap-components.min.js
echo "export...done"