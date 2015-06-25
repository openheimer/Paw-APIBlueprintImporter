{spawn, exec} = require 'child_process'
{ncp} = require 'ncp'
mkdirp = require 'mkdirp'
fs = require 'fs'

file = 'APIBlueprintImporter.coffee'
identifier = 'io.apiary.PawExtensions.APIBlueprintImporter'

extensions_dir = "#{ process.env.HOME }/Library/Containers/com.luckymarmot.Paw/Data/Library/Application Support/com.luckymarmot.Paw/Extensions/"
build_root_dir = "build"
build_dir = "#{ build_root_dir }/#{ identifier }"

# compile CoffeeScript
build_coffee = (callback) ->
    coffee = spawn './node_modules/coffee-script/bin/coffee', ['-c', '-o', build_dir, file]
    coffee.stderr.on 'data', (data) ->
        process.stderr.write data.toString()
    coffee.stdout.on 'data', (data) ->
        process.stdout.write data.toString()
    coffee.on 'exit', (code) ->
        if code is 0
            callback?()
        else
            console.error "Build failed with error: #{ code }"

# copy files to build directory
build_copy = () ->
    fs.writeFileSync "#{ build_dir }/README.md", fs.readFileSync("./README.md")
    fs.writeFileSync "#{ build_dir }/LICENSE", fs.readFileSync("./LICENSE")

# build: build CoffeeScript and copy files to build directory
build = (callback) ->
    # mkdir build dir
    mkdirp build_dir, (err) ->
        if err
            console.error err
        else
            build_coffee () ->
                build_copy()
                callback?()

# install: copy files to Extensions directory
install = (callback) ->
    ncp build_dir, "#{ extensions_dir }/#{ identifier }", (err) ->
        if err
            console.error err
        else
            callback?()

# archive: create a zip archive from the build
archive = (callback) ->
    zip_file = "#{ identifier.split('.').pop() }.zip"

    # go to build dir
    process.chdir "#{ build_root_dir }/"

    # delete any previous zip
    if fs.existsSync zip_file
        fs.unlinkSync zip_file

    # zip
    zip = spawn 'zip', ["-r", zip_file, "#{ identifier }/"]
    zip.stderr.on 'data', (data) ->
        process.stderr.write data.toString()
    zip.stdout.on 'data', (data) ->
        process.stdout.write data.toString()
    zip.on 'exit', (code) ->
        if code is 0
            callback?()
        else
            console.error "zip returned with error code: #{ code }"

task 'build', ->
    build()

task 'test', ->
  exec './node_modules/mocha/bin/mocha --compilers coffee:coffee-script/register test.coffee', (err, output) ->
    console.log output
    throw err if err

task 'install', ->
    build () ->
        install()

task 'archive', ->
    build () ->
        archive()

task 'watch', ->
    # find all files in directory
    for filename in fs.readdirSync '.'
        # only watch non-hidden files
        if not filename.match(/^\./) and fs.lstatSync("./#{ filename }").isFile()
            fs.watchFile "./#{ filename }", {persistent:true, interval:500}, (_event, _filename) ->
                # when a file is changed, build and install
                build () ->
                    install()
