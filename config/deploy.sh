#!/usr/bin/env bash
case "$1" in
    "hangman") 
        name="hangman"
        folder="HangmanGame" ;;
    "pair") 
        name="pair"
        folder="PairGame" ;;
    "basket") 
        name="basket"
        folder="BasketGame" ;;
    "quiz") 
        name="quiz"
        folder="QuizGame" ;;
    "sort") 
        name="sort"
        folder="SortGame" ;;
    "memo") 
        name="memo"
        folder="MemoGame" ;;
    "puzzle")
        name="puzzle"
        folder="PuzzleGame" ;;
    "crossword")
        name="crossword"
        folder="CrosswordGame" ;;
    "picture")
        name="picture"
        folder="PictureGame" ;;
    "all")
        for i in hangman pair basket quiz sort memo puzzle crossword picture
        do
            bash ./deploy.sh $i;
        done
        exit ;;
    *)
        echo "Specify type of a game"
        exit ;;
esac

rm -r release-$name 2>/dev/null
rm release-$name.zip 2>/dev/null

mkdir -p "release-$name"
cp "game_$name.html" "release-$name/game_$name.html"
cp "index_$name.html" "release-$name/index.html"
cp -R "css" "release-$name/css"
mkdir -p release-$name/img
cp img/* "release-$name/img" 2>/dev/null
cp -R "img/$folder" "release-$name/img" 2>/dev/null
mkdir -p release-$name/js
cp js/* "release-$name/js" 2>/dev/null
cp -R "js/$folder" "release-$name/js"
mkdir -p release-$name/config
cp config/* "release-$name/config" 2>/dev/null
cp -R "config/$folder" "release-$name/config"

./node_modules/javascript-obfuscator/bin/javascript-obfuscator ./release-$name/js --output .
./node_modules/javascript-obfuscator/bin/javascript-obfuscator ./release-$name/config --output . --unicode-escape-sequence true

touch release-$name/js/release.js

for OUTPUT in $(grep game_$name.html -e script | cut -d "\"" -f2 | grep -vE '(<script>|</script>|.*\.min\.js.*)')
do
    cat release-$name/$OUTPUT >> release-$name/js/release.js
    sed -i "/<script.*src.*${OUTPUT//\//\\\/}.*>/d" ./release-$name/game_$name.html
    rm release-$name/$OUTPUT
done

rmdir -p release-$name/js/$folder 2>/dev/null

sed -i "s/<\/head>/<script src=\"js\/release.js\"><\/script>\n<\/head>/" ./release-$name/game_$name.html

zip -r release-$name.zip release-$name
