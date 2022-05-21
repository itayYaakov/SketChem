var IndigoModule = (function () {
    var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : undefined;
    return function (IndigoModule) {
        IndigoModule = IndigoModule || {};

        var Module = typeof IndigoModule !== "undefined" ? IndigoModule : {};
        if (typeof Module === "undefined") {
            Module = {};
        }
        Module.onRuntimeInitialized = function () {
            if (typeof document !== "undefined" && document.dispatchEvent) {
                var event = new CustomEvent("Indigo.Initialized", { detail: { module: Module } });
                document.dispatchEvent(event);
            }
            if (typeof __$indigoInitialized$__ === "function") {
                __$indigoInitialized$__({ module: Module });
            }
        };
        var moduleOverrides = {};
        var key;
        for (key in Module) {
            if (Module.hasOwnProperty(key)) {
                moduleOverrides[key] = Module[key];
            }
        }
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = function (status, toThrow) {
            throw toThrow;
        };
        var ENVIRONMENT_IS_WEB = false;
        var ENVIRONMENT_IS_WORKER = false;
        var ENVIRONMENT_IS_NODE = false;
        var ENVIRONMENT_HAS_NODE = false;
        var ENVIRONMENT_IS_SHELL = false;
        ENVIRONMENT_IS_WEB = typeof window === "object";
        ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
        ENVIRONMENT_HAS_NODE =
            typeof process === "object" &&
            typeof process.versions === "object" &&
            typeof process.versions.node === "string";
        ENVIRONMENT_IS_NODE = ENVIRONMENT_HAS_NODE && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
        ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        var scriptDirectory = "";
        function locateFile(path) {
            if (Module["locateFile"]) {
                return Module["locateFile"](path, scriptDirectory);
            }
            return scriptDirectory + path;
        }
        var read_, readAsync, readBinary, setWindowTitle;
        if (ENVIRONMENT_IS_NODE) {
            scriptDirectory = __dirname + "/";
            var nodeFS;
            var nodePath;
            read_ = function shell_read(filename, binary) {
                var ret;
                if (!nodeFS) nodeFS = require("fs");
                if (!nodePath) nodePath = require("path");
                filename = nodePath["normalize"](filename);
                ret = nodeFS["readFileSync"](filename);
                return binary ? ret : ret.toString();
            };
            readBinary = function readBinary(filename) {
                var ret = read_(filename, true);
                if (!ret.buffer) {
                    ret = new Uint8Array(ret);
                }
                assert(ret.buffer);
                return ret;
            };
            if (process["argv"].length > 1) {
                thisProgram = process["argv"][1].replace(/\\/g, "/");
            }
            arguments_ = process["argv"].slice(2);
            process["on"]("uncaughtException", function (ex) {
                if (!(ex instanceof ExitStatus)) {
                    throw ex;
                }
            });
            process["on"]("unhandledRejection", abort);
            quit_ = function (status) {
                process["exit"](status);
            };
            Module["inspect"] = function () {
                return "[Emscripten Module object]";
            };
        } else if (ENVIRONMENT_IS_SHELL) {
            if (typeof read != "undefined") {
                read_ = function shell_read(f) {
                    return read(f);
                };
            }
            readBinary = function readBinary(f) {
                var data;
                if (typeof readbuffer === "function") {
                    return new Uint8Array(readbuffer(f));
                }
                data = read(f, "binary");
                assert(typeof data === "object");
                return data;
            };
            if (typeof scriptArgs != "undefined") {
                arguments_ = scriptArgs;
            } else if (typeof arguments != "undefined") {
                arguments_ = arguments;
            }
            if (typeof quit === "function") {
                quit_ = function (status) {
                    quit(status);
                };
            }
            if (typeof print !== "undefined") {
                if (typeof console === "undefined") console = {};
                console.log = print;
                console.warn = console.error = typeof printErr !== "undefined" ? printErr : print;
            }
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            if (ENVIRONMENT_IS_WORKER) {
                scriptDirectory = self.location.href;
            } else if (document.currentScript) {
                scriptDirectory = document.currentScript.src;
            }
            if (_scriptDir) {
                scriptDirectory = _scriptDir;
            }
            if (scriptDirectory.indexOf("blob:") !== 0) {
                scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
            } else {
                scriptDirectory = "";
            }
            read_ = function shell_read(url) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.send(null);
                return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) {
                readBinary = function readBinary(url) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url, false);
                    xhr.responseType = "arraybuffer";
                    xhr.send(null);
                    return new Uint8Array(xhr.response);
                };
            }
            readAsync = function readAsync(url, onload, onerror) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = function xhr_onload() {
                    if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
                        onload(xhr.response);
                        return;
                    }
                    onerror();
                };
                xhr.onerror = onerror;
                xhr.send(null);
            };
            setWindowTitle = function (title) {
                document.title = title;
            };
        } else {
        }
        var out = Module["print"] || console.log.bind(console);
        var err = Module["printErr"] || console.warn.bind(console);
        for (key in moduleOverrides) {
            if (moduleOverrides.hasOwnProperty(key)) {
                Module[key] = moduleOverrides[key];
            }
        }
        moduleOverrides = null;
        if (Module["arguments"]) arguments_ = Module["arguments"];
        if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
        if (Module["quit"]) quit_ = Module["quit"];
        function dynamicAlloc(size) {
            var ret = HEAP32[DYNAMICTOP_PTR >> 2];
            var end = (ret + size + 15) & -16;
            if (end > _emscripten_get_heap_size()) {
                abort();
            }
            HEAP32[DYNAMICTOP_PTR >> 2] = end;
            return ret;
        }
        function getNativeTypeSize(type) {
            switch (type) {
                case "i1":
                case "i8":
                    return 1;
                case "i16":
                    return 2;
                case "i32":
                    return 4;
                case "i64":
                    return 8;
                case "float":
                    return 4;
                case "double":
                    return 8;
                default: {
                    if (type[type.length - 1] === "*") {
                        return 4;
                    } else if (type[0] === "i") {
                        var bits = parseInt(type.substr(1));
                        assert(bits % 8 === 0, "getNativeTypeSize invalid bits " + bits + ", type " + type);
                        return bits / 8;
                    } else {
                        return 0;
                    }
                }
            }
        }
        var asm2wasmImports = {
            "f64-rem": function (x, y) {
                return x % y;
            },
            debugger: function () {},
        };
        var functionPointers = new Array(0);
        var tempRet0 = 0;
        var setTempRet0 = function (value) {
            tempRet0 = value;
        };
        var getTempRet0 = function () {
            return tempRet0;
        };
        var wasmBinary;
        if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
        var noExitRuntime;
        if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
        if (typeof WebAssembly !== "object") {
            err("no native wasm support detected");
        }
        function setValue(ptr, value, type, noSafe) {
            type = type || "i8";
            if (type.charAt(type.length - 1) === "*") type = "i32";
            switch (type) {
                case "i1":
                    HEAP8[ptr >> 0] = value;
                    break;
                case "i8":
                    HEAP8[ptr >> 0] = value;
                    break;
                case "i16":
                    HEAP16[ptr >> 1] = value;
                    break;
                case "i32":
                    HEAP32[ptr >> 2] = value;
                    break;
                case "i64":
                    (tempI64 = [
                        value >>> 0,
                        ((tempDouble = value),
                        +Math_abs(tempDouble) >= 1
                            ? tempDouble > 0
                                ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0
                                : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
                            : 0),
                    ]),
                        (HEAP32[ptr >> 2] = tempI64[0]),
                        (HEAP32[(ptr + 4) >> 2] = tempI64[1]);
                    break;
                case "float":
                    HEAPF32[ptr >> 2] = value;
                    break;
                case "double":
                    HEAPF64[ptr >> 3] = value;
                    break;
                default:
                    abort("invalid type for setValue: " + type);
            }
        }
        var wasmMemory;
        var wasmTable = new WebAssembly.Table({ initial: 6461, maximum: 6461, element: "anyfunc" });
        var ABORT = false;
        var EXITSTATUS = 0;
        function assert(condition, text) {
            if (!condition) {
                abort("Assertion failed: " + text);
            }
        }
        function getCFunc(ident) {
            var func = Module["_" + ident];
            assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
            return func;
        }
        function ccall(ident, returnType, argTypes, args, opts) {
            var toC = {
                string: function (str) {
                    var ret = 0;
                    if (str !== null && str !== undefined && str !== 0) {
                        var len = (str.length << 2) + 1;
                        ret = stackAlloc(len);
                        stringToUTF8(str, ret, len);
                    }
                    return ret;
                },
                array: function (arr) {
                    var ret = stackAlloc(arr.length);
                    writeArrayToMemory(arr, ret);
                    return ret;
                },
            };
            function convertReturnValue(ret) {
                if (returnType === "string") return UTF8ToString(ret);
                if (returnType === "boolean") return Boolean(ret);
                return ret;
            }
            var func = getCFunc(ident);
            var cArgs = [];
            var stack = 0;
            if (args) {
                for (var i = 0; i < args.length; i++) {
                    var converter = toC[argTypes[i]];
                    if (converter) {
                        if (stack === 0) stack = stackSave();
                        cArgs[i] = converter(args[i]);
                    } else {
                        cArgs[i] = args[i];
                    }
                }
            }
            var ret = func.apply(null, cArgs);
            ret = convertReturnValue(ret);
            if (stack !== 0) stackRestore(stack);
            return ret;
        }
        function cwrap(ident, returnType, argTypes, opts) {
            argTypes = argTypes || [];
            var numericArgs = argTypes.every(function (type) {
                return type === "number";
            });
            var numericRet = returnType !== "string";
            if (numericRet && numericArgs && !opts) {
                return getCFunc(ident);
            }
            return function () {
                return ccall(ident, returnType, argTypes, arguments, opts);
            };
        }
        var ALLOC_NORMAL = 0;
        var ALLOC_NONE = 3;
        function allocate(slab, types, allocator, ptr) {
            var zeroinit, size;
            if (typeof slab === "number") {
                zeroinit = true;
                size = slab;
            } else {
                zeroinit = false;
                size = slab.length;
            }
            var singleType = typeof types === "string" ? types : null;
            var ret;
            if (allocator == ALLOC_NONE) {
                ret = ptr;
            } else {
                ret = [_malloc, stackAlloc, dynamicAlloc][allocator](Math.max(size, singleType ? 1 : types.length));
            }
            if (zeroinit) {
                var stop;
                ptr = ret;
                assert((ret & 3) == 0);
                stop = ret + (size & ~3);
                for (; ptr < stop; ptr += 4) {
                    HEAP32[ptr >> 2] = 0;
                }
                stop = ret + size;
                while (ptr < stop) {
                    HEAP8[ptr++ >> 0] = 0;
                }
                return ret;
            }
            if (singleType === "i8") {
                if (slab.subarray || slab.slice) {
                    HEAPU8.set(slab, ret);
                } else {
                    HEAPU8.set(new Uint8Array(slab), ret);
                }
                return ret;
            }
            var i = 0,
                type,
                typeSize,
                previousType;
            while (i < size) {
                var curr = slab[i];
                type = singleType || types[i];
                if (type === 0) {
                    i++;
                    continue;
                }
                if (type == "i64") type = "i32";
                setValue(ret + i, curr, type);
                if (previousType !== type) {
                    typeSize = getNativeTypeSize(type);
                    previousType = type;
                }
                i += typeSize;
            }
            return ret;
        }
        function getMemory(size) {
            if (!runtimeInitialized) return dynamicAlloc(size);
            return _malloc(size);
        }
        var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
        function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
            var endIdx = idx + maxBytesToRead;
            var endPtr = idx;
            while (u8Array[endPtr] && !(endPtr >= endIdx)) ++endPtr;
            if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
                return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
            } else {
                var str = "";
                while (idx < endPtr) {
                    var u0 = u8Array[idx++];
                    if (!(u0 & 128)) {
                        str += String.fromCharCode(u0);
                        continue;
                    }
                    var u1 = u8Array[idx++] & 63;
                    if ((u0 & 224) == 192) {
                        str += String.fromCharCode(((u0 & 31) << 6) | u1);
                        continue;
                    }
                    var u2 = u8Array[idx++] & 63;
                    if ((u0 & 240) == 224) {
                        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
                    } else {
                        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (u8Array[idx++] & 63);
                    }
                    if (u0 < 65536) {
                        str += String.fromCharCode(u0);
                    } else {
                        var ch = u0 - 65536;
                        str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
                    }
                }
            }
            return str;
        }
        function UTF8ToString(ptr, maxBytesToRead) {
            return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        }
        function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
            if (!(maxBytesToWrite > 0)) return 0;
            var startIdx = outIdx;
            var endIdx = outIdx + maxBytesToWrite - 1;
            for (var i = 0; i < str.length; ++i) {
                var u = str.charCodeAt(i);
                if (u >= 55296 && u <= 57343) {
                    var u1 = str.charCodeAt(++i);
                    u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
                }
                if (u <= 127) {
                    if (outIdx >= endIdx) break;
                    outU8Array[outIdx++] = u;
                } else if (u <= 2047) {
                    if (outIdx + 1 >= endIdx) break;
                    outU8Array[outIdx++] = 192 | (u >> 6);
                    outU8Array[outIdx++] = 128 | (u & 63);
                } else if (u <= 65535) {
                    if (outIdx + 2 >= endIdx) break;
                    outU8Array[outIdx++] = 224 | (u >> 12);
                    outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
                    outU8Array[outIdx++] = 128 | (u & 63);
                } else {
                    if (outIdx + 3 >= endIdx) break;
                    outU8Array[outIdx++] = 240 | (u >> 18);
                    outU8Array[outIdx++] = 128 | ((u >> 12) & 63);
                    outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
                    outU8Array[outIdx++] = 128 | (u & 63);
                }
            }
            outU8Array[outIdx] = 0;
            return outIdx - startIdx;
        }
        function stringToUTF8(str, outPtr, maxBytesToWrite) {
            return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        }
        function lengthBytesUTF8(str) {
            var len = 0;
            for (var i = 0; i < str.length; ++i) {
                var u = str.charCodeAt(i);
                if (u >= 55296 && u <= 57343) u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
                if (u <= 127) ++len;
                else if (u <= 2047) len += 2;
                else if (u <= 65535) len += 3;
                else len += 4;
            }
            return len;
        }
        var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
        function allocateUTF8(str) {
            var size = lengthBytesUTF8(str) + 1;
            var ret = _malloc(size);
            if (ret) stringToUTF8Array(str, HEAP8, ret, size);
            return ret;
        }
        function writeArrayToMemory(array, buffer) {
            HEAP8.set(array, buffer);
        }
        function writeAsciiToMemory(str, buffer, dontAddNull) {
            for (var i = 0; i < str.length; ++i) {
                HEAP8[buffer++ >> 0] = str.charCodeAt(i);
            }
            if (!dontAddNull) HEAP8[buffer >> 0] = 0;
        }
        var WASM_PAGE_SIZE = 65536;
        var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        function updateGlobalBufferAndViews(buf) {
            buffer = buf;
            Module["HEAP8"] = HEAP8 = new Int8Array(buf);
            Module["HEAP16"] = HEAP16 = new Int16Array(buf);
            Module["HEAP32"] = HEAP32 = new Int32Array(buf);
            Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
            Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
            Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
            Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
            Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
        }
        var DYNAMIC_BASE = 5754672,
            DYNAMICTOP_PTR = 511568;
        var INITIAL_TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
        if (Module["wasmMemory"]) {
            wasmMemory = Module["wasmMemory"];
        } else {
            wasmMemory = new WebAssembly.Memory({
                initial: INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE,
                maximum: INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE,
            });
        }
        if (wasmMemory) {
            buffer = wasmMemory.buffer;
        }
        INITIAL_TOTAL_MEMORY = buffer.byteLength;
        updateGlobalBufferAndViews(buffer);
        HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
        function callRuntimeCallbacks(callbacks) {
            while (callbacks.length > 0) {
                var callback = callbacks.shift();
                if (typeof callback == "function") {
                    callback();
                    continue;
                }
                var func = callback.func;
                if (typeof func === "number") {
                    if (callback.arg === undefined) {
                        Module["dynCall_v"](func);
                    } else {
                        Module["dynCall_vi"](func, callback.arg);
                    }
                } else {
                    func(callback.arg === undefined ? null : callback.arg);
                }
            }
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        function preRun() {
            if (Module["preRun"]) {
                if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
                while (Module["preRun"].length) {
                    addOnPreRun(Module["preRun"].shift());
                }
            }
            callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
            runtimeInitialized = true;
            if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
            TTY.init();
            callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
            FS.ignorePermissions = false;
            callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
            if (Module["postRun"]) {
                if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
                while (Module["postRun"].length) {
                    addOnPostRun(Module["postRun"].shift());
                }
            }
            callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
            __ATPRERUN__.unshift(cb);
        }
        function addOnPostRun(cb) {
            __ATPOSTRUN__.unshift(cb);
        }
        var Math_abs = Math.abs;
        var Math_ceil = Math.ceil;
        var Math_floor = Math.floor;
        var Math_min = Math.min;
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function getUniqueRunDependency(id) {
            return id;
        }
        function addRunDependency(id) {
            runDependencies++;
            if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies);
            }
        }
        function removeRunDependency(id) {
            runDependencies--;
            if (Module["monitorRunDependencies"]) {
                Module["monitorRunDependencies"](runDependencies);
            }
            if (runDependencies == 0) {
                if (runDependencyWatcher !== null) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null;
                }
                if (dependenciesFulfilled) {
                    var callback = dependenciesFulfilled;
                    dependenciesFulfilled = null;
                    callback();
                }
            }
        }
        Module["preloadedImages"] = {};
        Module["preloadedAudios"] = {};
        function abort(what) {
            if (Module["onAbort"]) {
                Module["onAbort"](what);
            }
            what += "";
            out(what);
            err(what);
            ABORT = true;
            EXITSTATUS = 1;
            throw "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        function isDataURI(filename) {
            return String.prototype.startsWith
                ? filename.startsWith(dataURIPrefix)
                : filename.indexOf(dataURIPrefix) === 0;
        }
        var wasmBinaryFile = "indigo.wasm";
        if (!isDataURI(wasmBinaryFile)) {
            wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinary() {
            try {
                if (wasmBinary) {
                    return new Uint8Array(wasmBinary);
                }
                if (readBinary) {
                    return readBinary(wasmBinaryFile);
                } else {
                    throw "both async and sync fetching of the wasm failed";
                }
            } catch (err) {
                abort(err);
            }
        }
        function getBinaryPromise() {
            if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
                return fetch(wasmBinaryFile, { credentials: "same-origin" })
                    .then(function (response) {
                        if (!response["ok"]) {
                            throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
                        }
                        return response["arrayBuffer"]();
                    })
                    .catch(function () {
                        return getBinary();
                    });
            }
            return new Promise(function (resolve, reject) {
                resolve(getBinary());
            });
        }
        function createWasm() {
            var info = {
                env: asmLibraryArg,
                wasi_unstable: asmLibraryArg,
                global: { NaN: NaN, Infinity: Infinity },
                "global.Math": Math,
                asm2wasm: asm2wasmImports,
            };
            function receiveInstance(instance, module) {
                var exports = instance.exports;
                Module["asm"] = exports;
                removeRunDependency("wasm-instantiate");
            }
            addRunDependency("wasm-instantiate");
            function receiveInstantiatedSource(output) {
                receiveInstance(output["instance"]);
            }
            function instantiateArrayBuffer(receiver) {
                return getBinaryPromise()
                    .then(function (binary) {
                        return WebAssembly.instantiate(binary, info);
                    })
                    .then(receiver, function (reason) {
                        err("failed to asynchronously prepare wasm: " + reason);
                        abort(reason);
                    });
            }
            function instantiateAsync() {
                if (
                    !wasmBinary &&
                    typeof WebAssembly.instantiateStreaming === "function" &&
                    !isDataURI(wasmBinaryFile) &&
                    typeof fetch === "function"
                ) {
                    fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function (response) {
                        var result = WebAssembly.instantiateStreaming(response, info);
                        return result.then(receiveInstantiatedSource, function (reason) {
                            err("wasm streaming compile failed: " + reason);
                            err("falling back to ArrayBuffer instantiation");
                            instantiateArrayBuffer(receiveInstantiatedSource);
                        });
                    });
                } else {
                    return instantiateArrayBuffer(receiveInstantiatedSource);
                }
            }
            if (Module["instantiateWasm"]) {
                try {
                    var exports = Module["instantiateWasm"](info, receiveInstance);
                    return exports;
                } catch (e) {
                    err("Module.instantiateWasm callback failed with error: " + e);
                    return false;
                }
            }
            instantiateAsync();
            return {};
        }
        Module["asm"] = createWasm;
        var tempDouble;
        var tempI64;
        __ATINIT__.push({
            func: function () {
                globalCtors();
            },
        });
        function demangle(func) {
            return func;
        }
        function demangleAll(text) {
            var regex = /\b__Z[\w\d_]+/g;
            return text.replace(regex, function (x) {
                var y = demangle(x);
                return x === y ? x : y + " [" + x + "]";
            });
        }
        function jsStackTrace() {
            var err = new Error();
            if (!err.stack) {
                try {
                    throw new Error(0);
                } catch (e) {
                    err = e;
                }
                if (!err.stack) {
                    return "(no stack trace available)";
                }
            }
            return err.stack.toString();
        }
        function stackTrace() {
            var js = jsStackTrace();
            if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
            return demangleAll(js);
        }
        function ___assert_fail(condition, filename, line, func) {
            abort(
                "Assertion failed: " +
                    UTF8ToString(condition) +
                    ", at: " +
                    [
                        filename ? UTF8ToString(filename) : "unknown filename",
                        line,
                        func ? UTF8ToString(func) : "unknown function",
                    ]
            );
        }
        var ENV = {};
        function ___buildEnvironment(environ) {
            var MAX_ENV_VALUES = 64;
            var TOTAL_ENV_SIZE = 1024;
            var poolPtr;
            var envPtr;
            if (!___buildEnvironment.called) {
                ___buildEnvironment.called = true;
                ENV["USER"] = ENV["LOGNAME"] = "web_user";
                ENV["PATH"] = "/";
                ENV["PWD"] = "/";
                ENV["HOME"] = "/home/web_user";
                ENV["LANG"] =
                    ((typeof navigator === "object" && navigator.languages && navigator.languages[0]) || "C").replace(
                        "-",
                        "_"
                    ) + ".UTF-8";
                ENV["_"] = thisProgram;
                poolPtr = getMemory(TOTAL_ENV_SIZE);
                envPtr = getMemory(MAX_ENV_VALUES * 4);
                HEAP32[envPtr >> 2] = poolPtr;
                HEAP32[environ >> 2] = envPtr;
            } else {
                envPtr = HEAP32[environ >> 2];
                poolPtr = HEAP32[envPtr >> 2];
            }
            var strings = [];
            var totalSize = 0;
            for (var key in ENV) {
                if (typeof ENV[key] === "string") {
                    var line = key + "=" + ENV[key];
                    strings.push(line);
                    totalSize += line.length;
                }
            }
            if (totalSize > TOTAL_ENV_SIZE) {
                throw new Error("Environment size exceeded TOTAL_ENV_SIZE!");
            }
            var ptrSize = 4;
            for (var i = 0; i < strings.length; i++) {
                var line = strings[i];
                writeAsciiToMemory(line, poolPtr);
                HEAP32[(envPtr + i * ptrSize) >> 2] = poolPtr;
                poolPtr += line.length + 1;
            }
            HEAP32[(envPtr + strings.length * ptrSize) >> 2] = 0;
        }
        function ___cxa_allocate_exception(size) {
            return _malloc(size);
        }
        var ___exception_infos = {};
        var ___exception_caught = [];
        function ___exception_addRef(ptr) {
            if (!ptr) return;
            var info = ___exception_infos[ptr];
            info.refcount++;
        }
        function ___exception_deAdjust(adjusted) {
            if (!adjusted || ___exception_infos[adjusted]) return adjusted;
            for (var key in ___exception_infos) {
                var ptr = +key;
                var adj = ___exception_infos[ptr].adjusted;
                var len = adj.length;
                for (var i = 0; i < len; i++) {
                    if (adj[i] === adjusted) {
                        return ptr;
                    }
                }
            }
            return adjusted;
        }
        function ___cxa_begin_catch(ptr) {
            var info = ___exception_infos[ptr];
            if (info && !info.caught) {
                info.caught = true;
                __ZSt18uncaught_exceptionv.uncaught_exceptions--;
            }
            if (info) info.rethrown = false;
            ___exception_caught.push(ptr);
            ___exception_addRef(___exception_deAdjust(ptr));
            return ptr;
        }
        var ___exception_last = 0;
        function ___cxa_free_exception(ptr) {
            try {
                return _free(ptr);
            } catch (e) {}
        }
        function ___exception_decRef(ptr) {
            if (!ptr) return;
            var info = ___exception_infos[ptr];
            info.refcount--;
            if (info.refcount === 0 && !info.rethrown) {
                if (info.destructor) {
                    Module["dynCall_vi"](info.destructor, ptr);
                }
                delete ___exception_infos[ptr];
                ___cxa_free_exception(ptr);
            }
        }
        function ___cxa_end_catch() {
            _setThrew(0);
            var ptr = ___exception_caught.pop();
            if (ptr) {
                ___exception_decRef(___exception_deAdjust(ptr));
                ___exception_last = 0;
            }
        }
        function ___resumeException(ptr) {
            if (!___exception_last) {
                ___exception_last = ptr;
            }
            throw ptr;
        }
        function ___cxa_find_matching_catch() {
            var thrown = ___exception_last;
            if (!thrown) {
                return (setTempRet0(0), 0) | 0;
            }
            var info = ___exception_infos[thrown];
            var throwntype = info.type;
            if (!throwntype) {
                return (setTempRet0(0), thrown) | 0;
            }
            var typeArray = Array.prototype.slice.call(arguments);
            var pointer = ___cxa_is_pointer_type(throwntype);
            var buffer = 511760;
            HEAP32[buffer >> 2] = thrown;
            thrown = buffer;
            for (var i = 0; i < typeArray.length; i++) {
                if (typeArray[i] && ___cxa_can_catch(typeArray[i], throwntype, thrown)) {
                    thrown = HEAP32[thrown >> 2];
                    info.adjusted.push(thrown);
                    return (setTempRet0(typeArray[i]), thrown) | 0;
                }
            }
            thrown = HEAP32[thrown >> 2];
            return (setTempRet0(throwntype), thrown) | 0;
        }
        Module["___cxa_find_matching_catch"] = ___cxa_find_matching_catch;
        function ___cxa_find_matching_catch_2(a0, a1) {
            return ___cxa_find_matching_catch(a0, a1);
        }
        function ___cxa_find_matching_catch_3(a0, a1, a2) {
            return ___cxa_find_matching_catch(a0, a1, a2);
        }
        function ___cxa_find_matching_catch_4(a0, a1, a2, a3) {
            return ___cxa_find_matching_catch(a0, a1, a2, a3);
        }
        function ___cxa_get_exception_ptr(ptr) {
            return ptr;
        }
        function ___cxa_rethrow() {
            var ptr = ___exception_caught.pop();
            ptr = ___exception_deAdjust(ptr);
            if (!___exception_infos[ptr].rethrown) {
                ___exception_caught.push(ptr);
                ___exception_infos[ptr].rethrown = true;
            }
            ___exception_last = ptr;
            throw ptr;
        }
        function ___cxa_throw(ptr, type, destructor) {
            ___exception_infos[ptr] = {
                ptr: ptr,
                adjusted: [ptr],
                type: type,
                destructor: destructor,
                refcount: 0,
                caught: false,
                rethrown: false,
            };
            ___exception_last = ptr;
            if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
                __ZSt18uncaught_exceptionv.uncaught_exceptions = 1;
            } else {
                __ZSt18uncaught_exceptionv.uncaught_exceptions++;
            }
            throw ptr;
        }
        function ___cxa_uncaught_exceptions() {
            return __ZSt18uncaught_exceptionv.uncaught_exceptions;
        }
        function ___lock() {}
        function ___setErrNo(value) {
            if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
            return value;
        }
        function ___map_file(pathname, size) {
            ___setErrNo(63);
            return -1;
        }
        var PATH = {
            splitPath: function (filename) {
                var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                return splitPathRe.exec(filename).slice(1);
            },
            normalizeArray: function (parts, allowAboveRoot) {
                var up = 0;
                for (var i = parts.length - 1; i >= 0; i--) {
                    var last = parts[i];
                    if (last === ".") {
                        parts.splice(i, 1);
                    } else if (last === "..") {
                        parts.splice(i, 1);
                        up++;
                    } else if (up) {
                        parts.splice(i, 1);
                        up--;
                    }
                }
                if (allowAboveRoot) {
                    for (; up; up--) {
                        parts.unshift("..");
                    }
                }
                return parts;
            },
            normalize: function (path) {
                var isAbsolute = path.charAt(0) === "/",
                    trailingSlash = path.substr(-1) === "/";
                path = PATH.normalizeArray(
                    path.split("/").filter(function (p) {
                        return !!p;
                    }),
                    !isAbsolute
                ).join("/");
                if (!path && !isAbsolute) {
                    path = ".";
                }
                if (path && trailingSlash) {
                    path += "/";
                }
                return (isAbsolute ? "/" : "") + path;
            },
            dirname: function (path) {
                var result = PATH.splitPath(path),
                    root = result[0],
                    dir = result[1];
                if (!root && !dir) {
                    return ".";
                }
                if (dir) {
                    dir = dir.substr(0, dir.length - 1);
                }
                return root + dir;
            },
            basename: function (path) {
                if (path === "/") return "/";
                var lastSlash = path.lastIndexOf("/");
                if (lastSlash === -1) return path;
                return path.substr(lastSlash + 1);
            },
            extname: function (path) {
                return PATH.splitPath(path)[3];
            },
            join: function () {
                var paths = Array.prototype.slice.call(arguments, 0);
                return PATH.normalize(paths.join("/"));
            },
            join2: function (l, r) {
                return PATH.normalize(l + "/" + r);
            },
        };
        var PATH_FS = {
            resolve: function () {
                var resolvedPath = "",
                    resolvedAbsolute = false;
                for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                    var path = i >= 0 ? arguments[i] : FS.cwd();
                    if (typeof path !== "string") {
                        throw new TypeError("Arguments to path.resolve must be strings");
                    } else if (!path) {
                        return "";
                    }
                    resolvedPath = path + "/" + resolvedPath;
                    resolvedAbsolute = path.charAt(0) === "/";
                }
                resolvedPath = PATH.normalizeArray(
                    resolvedPath.split("/").filter(function (p) {
                        return !!p;
                    }),
                    !resolvedAbsolute
                ).join("/");
                return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
            },
            relative: function (from, to) {
                from = PATH_FS.resolve(from).substr(1);
                to = PATH_FS.resolve(to).substr(1);
                function trim(arr) {
                    var start = 0;
                    for (; start < arr.length; start++) {
                        if (arr[start] !== "") break;
                    }
                    var end = arr.length - 1;
                    for (; end >= 0; end--) {
                        if (arr[end] !== "") break;
                    }
                    if (start > end) return [];
                    return arr.slice(start, end - start + 1);
                }
                var fromParts = trim(from.split("/"));
                var toParts = trim(to.split("/"));
                var length = Math.min(fromParts.length, toParts.length);
                var samePartsLength = length;
                for (var i = 0; i < length; i++) {
                    if (fromParts[i] !== toParts[i]) {
                        samePartsLength = i;
                        break;
                    }
                }
                var outputParts = [];
                for (var i = samePartsLength; i < fromParts.length; i++) {
                    outputParts.push("..");
                }
                outputParts = outputParts.concat(toParts.slice(samePartsLength));
                return outputParts.join("/");
            },
        };
        var TTY = {
            ttys: [],
            init: function () {},
            shutdown: function () {},
            register: function (dev, ops) {
                TTY.ttys[dev] = { input: [], output: [], ops: ops };
                FS.registerDevice(dev, TTY.stream_ops);
            },
            stream_ops: {
                open: function (stream) {
                    var tty = TTY.ttys[stream.node.rdev];
                    if (!tty) {
                        throw new FS.ErrnoError(43);
                    }
                    stream.tty = tty;
                    stream.seekable = false;
                },
                close: function (stream) {
                    stream.tty.ops.flush(stream.tty);
                },
                flush: function (stream) {
                    stream.tty.ops.flush(stream.tty);
                },
                read: function (stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.get_char) {
                        throw new FS.ErrnoError(60);
                    }
                    var bytesRead = 0;
                    for (var i = 0; i < length; i++) {
                        var result;
                        try {
                            result = stream.tty.ops.get_char(stream.tty);
                        } catch (e) {
                            throw new FS.ErrnoError(29);
                        }
                        if (result === undefined && bytesRead === 0) {
                            throw new FS.ErrnoError(6);
                        }
                        if (result === null || result === undefined) break;
                        bytesRead++;
                        buffer[offset + i] = result;
                    }
                    if (bytesRead) {
                        stream.node.timestamp = Date.now();
                    }
                    return bytesRead;
                },
                write: function (stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.put_char) {
                        throw new FS.ErrnoError(60);
                    }
                    try {
                        for (var i = 0; i < length; i++) {
                            stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                        }
                    } catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                    if (length) {
                        stream.node.timestamp = Date.now();
                    }
                    return i;
                },
            },
            default_tty_ops: {
                get_char: function (tty) {
                    if (!tty.input.length) {
                        var result = null;
                        if (ENVIRONMENT_IS_NODE) {
                            var BUFSIZE = 256;
                            var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
                            var bytesRead = 0;
                            try {
                                bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, null);
                            } catch (e) {
                                if (e.toString().indexOf("EOF") != -1) bytesRead = 0;
                                else throw e;
                            }
                            if (bytesRead > 0) {
                                result = buf.slice(0, bytesRead).toString("utf-8");
                            } else {
                                result = null;
                            }
                        } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                            result = window.prompt("Input: ");
                            if (result !== null) {
                                result += "\n";
                            }
                        } else if (typeof readline == "function") {
                            result = readline();
                            if (result !== null) {
                                result += "\n";
                            }
                        }
                        if (!result) {
                            return null;
                        }
                        tty.input = intArrayFromString(result, true);
                    }
                    return tty.input.shift();
                },
                put_char: function (tty, val) {
                    if (val === null || val === 10) {
                        out(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    } else {
                        if (val != 0) tty.output.push(val);
                    }
                },
                flush: function (tty) {
                    if (tty.output && tty.output.length > 0) {
                        out(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    }
                },
            },
            default_tty1_ops: {
                put_char: function (tty, val) {
                    if (val === null || val === 10) {
                        err(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    } else {
                        if (val != 0) tty.output.push(val);
                    }
                },
                flush: function (tty) {
                    if (tty.output && tty.output.length > 0) {
                        err(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    }
                },
            },
        };
        var MEMFS = {
            ops_table: null,
            mount: function (mount) {
                return MEMFS.createNode(null, "/", 16384 | 511, 0);
            },
            createNode: function (parent, name, mode, dev) {
                if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                    throw new FS.ErrnoError(63);
                }
                if (!MEMFS.ops_table) {
                    MEMFS.ops_table = {
                        dir: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                lookup: MEMFS.node_ops.lookup,
                                mknod: MEMFS.node_ops.mknod,
                                rename: MEMFS.node_ops.rename,
                                unlink: MEMFS.node_ops.unlink,
                                rmdir: MEMFS.node_ops.rmdir,
                                readdir: MEMFS.node_ops.readdir,
                                symlink: MEMFS.node_ops.symlink,
                            },
                            stream: { llseek: MEMFS.stream_ops.llseek },
                        },
                        file: {
                            node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr },
                            stream: {
                                llseek: MEMFS.stream_ops.llseek,
                                read: MEMFS.stream_ops.read,
                                write: MEMFS.stream_ops.write,
                                allocate: MEMFS.stream_ops.allocate,
                                mmap: MEMFS.stream_ops.mmap,
                                msync: MEMFS.stream_ops.msync,
                            },
                        },
                        link: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                readlink: MEMFS.node_ops.readlink,
                            },
                            stream: {},
                        },
                        chrdev: {
                            node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr },
                            stream: FS.chrdev_stream_ops,
                        },
                    };
                }
                var node = FS.createNode(parent, name, mode, dev);
                if (FS.isDir(node.mode)) {
                    node.node_ops = MEMFS.ops_table.dir.node;
                    node.stream_ops = MEMFS.ops_table.dir.stream;
                    node.contents = {};
                } else if (FS.isFile(node.mode)) {
                    node.node_ops = MEMFS.ops_table.file.node;
                    node.stream_ops = MEMFS.ops_table.file.stream;
                    node.usedBytes = 0;
                    node.contents = null;
                } else if (FS.isLink(node.mode)) {
                    node.node_ops = MEMFS.ops_table.link.node;
                    node.stream_ops = MEMFS.ops_table.link.stream;
                } else if (FS.isChrdev(node.mode)) {
                    node.node_ops = MEMFS.ops_table.chrdev.node;
                    node.stream_ops = MEMFS.ops_table.chrdev.stream;
                }
                node.timestamp = Date.now();
                if (parent) {
                    parent.contents[name] = node;
                }
                return node;
            },
            getFileDataAsRegularArray: function (node) {
                if (node.contents && node.contents.subarray) {
                    var arr = [];
                    for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
                    return arr;
                }
                return node.contents;
            },
            getFileDataAsTypedArray: function (node) {
                if (!node.contents) return new Uint8Array();
                if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
                return new Uint8Array(node.contents);
            },
            expandFileStorage: function (node, newCapacity) {
                var prevCapacity = node.contents ? node.contents.length : 0;
                if (prevCapacity >= newCapacity) return;
                var CAPACITY_DOUBLING_MAX = 1024 * 1024;
                newCapacity = Math.max(
                    newCapacity,
                    (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) | 0
                );
                if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
                var oldContents = node.contents;
                node.contents = new Uint8Array(newCapacity);
                if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
                return;
            },
            resizeFileStorage: function (node, newSize) {
                if (node.usedBytes == newSize) return;
                if (newSize == 0) {
                    node.contents = null;
                    node.usedBytes = 0;
                    return;
                }
                if (!node.contents || node.contents.subarray) {
                    var oldContents = node.contents;
                    node.contents = new Uint8Array(new ArrayBuffer(newSize));
                    if (oldContents) {
                        node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
                    }
                    node.usedBytes = newSize;
                    return;
                }
                if (!node.contents) node.contents = [];
                if (node.contents.length > newSize) node.contents.length = newSize;
                else while (node.contents.length < newSize) node.contents.push(0);
                node.usedBytes = newSize;
            },
            node_ops: {
                getattr: function (node) {
                    var attr = {};
                    attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
                    attr.ino = node.id;
                    attr.mode = node.mode;
                    attr.nlink = 1;
                    attr.uid = 0;
                    attr.gid = 0;
                    attr.rdev = node.rdev;
                    if (FS.isDir(node.mode)) {
                        attr.size = 4096;
                    } else if (FS.isFile(node.mode)) {
                        attr.size = node.usedBytes;
                    } else if (FS.isLink(node.mode)) {
                        attr.size = node.link.length;
                    } else {
                        attr.size = 0;
                    }
                    attr.atime = new Date(node.timestamp);
                    attr.mtime = new Date(node.timestamp);
                    attr.ctime = new Date(node.timestamp);
                    attr.blksize = 4096;
                    attr.blocks = Math.ceil(attr.size / attr.blksize);
                    return attr;
                },
                setattr: function (node, attr) {
                    if (attr.mode !== undefined) {
                        node.mode = attr.mode;
                    }
                    if (attr.timestamp !== undefined) {
                        node.timestamp = attr.timestamp;
                    }
                    if (attr.size !== undefined) {
                        MEMFS.resizeFileStorage(node, attr.size);
                    }
                },
                lookup: function (parent, name) {
                    throw FS.genericErrors[44];
                },
                mknod: function (parent, name, mode, dev) {
                    return MEMFS.createNode(parent, name, mode, dev);
                },
                rename: function (old_node, new_dir, new_name) {
                    if (FS.isDir(old_node.mode)) {
                        var new_node;
                        try {
                            new_node = FS.lookupNode(new_dir, new_name);
                        } catch (e) {}
                        if (new_node) {
                            for (var i in new_node.contents) {
                                throw new FS.ErrnoError(55);
                            }
                        }
                    }
                    delete old_node.parent.contents[old_node.name];
                    old_node.name = new_name;
                    new_dir.contents[new_name] = old_node;
                    old_node.parent = new_dir;
                },
                unlink: function (parent, name) {
                    delete parent.contents[name];
                },
                rmdir: function (parent, name) {
                    var node = FS.lookupNode(parent, name);
                    for (var i in node.contents) {
                        throw new FS.ErrnoError(55);
                    }
                    delete parent.contents[name];
                },
                readdir: function (node) {
                    var entries = [".", ".."];
                    for (var key in node.contents) {
                        if (!node.contents.hasOwnProperty(key)) {
                            continue;
                        }
                        entries.push(key);
                    }
                    return entries;
                },
                symlink: function (parent, newname, oldpath) {
                    var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
                    node.link = oldpath;
                    return node;
                },
                readlink: function (node) {
                    if (!FS.isLink(node.mode)) {
                        throw new FS.ErrnoError(28);
                    }
                    return node.link;
                },
            },
            stream_ops: {
                read: function (stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= stream.node.usedBytes) return 0;
                    var size = Math.min(stream.node.usedBytes - position, length);
                    if (size > 8 && contents.subarray) {
                        buffer.set(contents.subarray(position, position + size), offset);
                    } else {
                        for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
                    }
                    return size;
                },
                write: function (stream, buffer, offset, length, position, canOwn) {
                    if (!length) return 0;
                    var node = stream.node;
                    node.timestamp = Date.now();
                    if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                        if (canOwn) {
                            node.contents = buffer.subarray(offset, offset + length);
                            node.usedBytes = length;
                            return length;
                        } else if (node.usedBytes === 0 && position === 0) {
                            node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
                            node.usedBytes = length;
                            return length;
                        } else if (position + length <= node.usedBytes) {
                            node.contents.set(buffer.subarray(offset, offset + length), position);
                            return length;
                        }
                    }
                    MEMFS.expandFileStorage(node, position + length);
                    if (node.contents.subarray && buffer.subarray)
                        node.contents.set(buffer.subarray(offset, offset + length), position);
                    else {
                        for (var i = 0; i < length; i++) {
                            node.contents[position + i] = buffer[offset + i];
                        }
                    }
                    node.usedBytes = Math.max(node.usedBytes, position + length);
                    return length;
                },
                llseek: function (stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position;
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            position += stream.node.usedBytes;
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(28);
                    }
                    return position;
                },
                allocate: function (stream, offset, length) {
                    MEMFS.expandFileStorage(stream.node, offset + length);
                    stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
                },
                mmap: function (stream, buffer, offset, length, position, prot, flags) {
                    if (!FS.isFile(stream.node.mode)) {
                        throw new FS.ErrnoError(43);
                    }
                    var ptr;
                    var allocated;
                    var contents = stream.node.contents;
                    if (!(flags & 2) && (contents.buffer === buffer || contents.buffer === buffer.buffer)) {
                        allocated = false;
                        ptr = contents.byteOffset;
                    } else {
                        if (position > 0 || position + length < stream.node.usedBytes) {
                            if (contents.subarray) {
                                contents = contents.subarray(position, position + length);
                            } else {
                                contents = Array.prototype.slice.call(contents, position, position + length);
                            }
                        }
                        allocated = true;
                        var fromHeap = buffer.buffer == HEAP8.buffer;
                        ptr = _malloc(length);
                        if (!ptr) {
                            throw new FS.ErrnoError(48);
                        }
                        (fromHeap ? HEAP8 : buffer).set(contents, ptr);
                    }
                    return { ptr: ptr, allocated: allocated };
                },
                msync: function (stream, buffer, offset, length, mmapFlags) {
                    if (!FS.isFile(stream.node.mode)) {
                        throw new FS.ErrnoError(43);
                    }
                    if (mmapFlags & 2) {
                        return 0;
                    }
                    var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
                    return 0;
                },
            },
        };
        var IDBFS = {
            dbs: {},
            indexedDB: function () {
                if (typeof indexedDB !== "undefined") return indexedDB;
                var ret = null;
                if (typeof window === "object")
                    ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                assert(ret, "IDBFS used, but indexedDB not supported");
                return ret;
            },
            DB_VERSION: 21,
            DB_STORE_NAME: "FILE_DATA",
            mount: function (mount) {
                return MEMFS.mount.apply(null, arguments);
            },
            syncfs: function (mount, populate, callback) {
                IDBFS.getLocalSet(mount, function (err, local) {
                    if (err) return callback(err);
                    IDBFS.getRemoteSet(mount, function (err, remote) {
                        if (err) return callback(err);
                        var src = populate ? remote : local;
                        var dst = populate ? local : remote;
                        IDBFS.reconcile(src, dst, callback);
                    });
                });
            },
            getDB: function (name, callback) {
                var db = IDBFS.dbs[name];
                if (db) {
                    return callback(null, db);
                }
                var req;
                try {
                    req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
                } catch (e) {
                    return callback(e);
                }
                if (!req) {
                    return callback("Unable to connect to IndexedDB");
                }
                req.onupgradeneeded = function (e) {
                    var db = e.target.result;
                    var transaction = e.target.transaction;
                    var fileStore;
                    if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
                        fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
                    } else {
                        fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
                    }
                    if (!fileStore.indexNames.contains("timestamp")) {
                        fileStore.createIndex("timestamp", "timestamp", { unique: false });
                    }
                };
                req.onsuccess = function () {
                    db = req.result;
                    IDBFS.dbs[name] = db;
                    callback(null, db);
                };
                req.onerror = function (e) {
                    callback(this.error);
                    e.preventDefault();
                };
            },
            getLocalSet: function (mount, callback) {
                var entries = {};
                function isRealDir(p) {
                    return p !== "." && p !== "..";
                }
                function toAbsolute(root) {
                    return function (p) {
                        return PATH.join2(root, p);
                    };
                }
                var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
                while (check.length) {
                    var path = check.pop();
                    var stat;
                    try {
                        stat = FS.stat(path);
                    } catch (e) {
                        return callback(e);
                    }
                    if (FS.isDir(stat.mode)) {
                        check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
                    }
                    entries[path] = { timestamp: stat.mtime };
                }
                return callback(null, { type: "local", entries: entries });
            },
            getRemoteSet: function (mount, callback) {
                var entries = {};
                IDBFS.getDB(mount.mountpoint, function (err, db) {
                    if (err) return callback(err);
                    try {
                        var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
                        transaction.onerror = function (e) {
                            callback(this.error);
                            e.preventDefault();
                        };
                        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                        var index = store.index("timestamp");
                        index.openKeyCursor().onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (!cursor) {
                                return callback(null, { type: "remote", db: db, entries: entries });
                            }
                            entries[cursor.primaryKey] = { timestamp: cursor.key };
                            cursor.continue();
                        };
                    } catch (e) {
                        return callback(e);
                    }
                });
            },
            loadLocalEntry: function (path, callback) {
                var stat, node;
                try {
                    var lookup = FS.lookupPath(path);
                    node = lookup.node;
                    stat = FS.stat(path);
                } catch (e) {
                    return callback(e);
                }
                if (FS.isDir(stat.mode)) {
                    return callback(null, { timestamp: stat.mtime, mode: stat.mode });
                } else if (FS.isFile(stat.mode)) {
                    node.contents = MEMFS.getFileDataAsTypedArray(node);
                    return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
                } else {
                    return callback(new Error("node type not supported"));
                }
            },
            storeLocalEntry: function (path, entry, callback) {
                try {
                    if (FS.isDir(entry.mode)) {
                        FS.mkdir(path, entry.mode);
                    } else if (FS.isFile(entry.mode)) {
                        FS.writeFile(path, entry.contents, { canOwn: true });
                    } else {
                        return callback(new Error("node type not supported"));
                    }
                    FS.chmod(path, entry.mode);
                    FS.utime(path, entry.timestamp, entry.timestamp);
                } catch (e) {
                    return callback(e);
                }
                callback(null);
            },
            removeLocalEntry: function (path, callback) {
                try {
                    var lookup = FS.lookupPath(path);
                    var stat = FS.stat(path);
                    if (FS.isDir(stat.mode)) {
                        FS.rmdir(path);
                    } else if (FS.isFile(stat.mode)) {
                        FS.unlink(path);
                    }
                } catch (e) {
                    return callback(e);
                }
                callback(null);
            },
            loadRemoteEntry: function (store, path, callback) {
                var req = store.get(path);
                req.onsuccess = function (event) {
                    callback(null, event.target.result);
                };
                req.onerror = function (e) {
                    callback(this.error);
                    e.preventDefault();
                };
            },
            storeRemoteEntry: function (store, path, entry, callback) {
                var req = store.put(entry, path);
                req.onsuccess = function () {
                    callback(null);
                };
                req.onerror = function (e) {
                    callback(this.error);
                    e.preventDefault();
                };
            },
            removeRemoteEntry: function (store, path, callback) {
                var req = store.delete(path);
                req.onsuccess = function () {
                    callback(null);
                };
                req.onerror = function (e) {
                    callback(this.error);
                    e.preventDefault();
                };
            },
            reconcile: function (src, dst, callback) {
                var total = 0;
                var create = [];
                Object.keys(src.entries).forEach(function (key) {
                    var e = src.entries[key];
                    var e2 = dst.entries[key];
                    if (!e2 || e.timestamp > e2.timestamp) {
                        create.push(key);
                        total++;
                    }
                });
                var remove = [];
                Object.keys(dst.entries).forEach(function (key) {
                    var e = dst.entries[key];
                    var e2 = src.entries[key];
                    if (!e2) {
                        remove.push(key);
                        total++;
                    }
                });
                if (!total) {
                    return callback(null);
                }
                var errored = false;
                var db = src.type === "remote" ? src.db : dst.db;
                var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
                var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                function done(err) {
                    if (err && !errored) {
                        errored = true;
                        return callback(err);
                    }
                }
                transaction.onerror = function (e) {
                    done(this.error);
                    e.preventDefault();
                };
                transaction.oncomplete = function (e) {
                    if (!errored) {
                        callback(null);
                    }
                };
                create.sort().forEach(function (path) {
                    if (dst.type === "local") {
                        IDBFS.loadRemoteEntry(store, path, function (err, entry) {
                            if (err) return done(err);
                            IDBFS.storeLocalEntry(path, entry, done);
                        });
                    } else {
                        IDBFS.loadLocalEntry(path, function (err, entry) {
                            if (err) return done(err);
                            IDBFS.storeRemoteEntry(store, path, entry, done);
                        });
                    }
                });
                remove
                    .sort()
                    .reverse()
                    .forEach(function (path) {
                        if (dst.type === "local") {
                            IDBFS.removeLocalEntry(path, done);
                        } else {
                            IDBFS.removeRemoteEntry(store, path, done);
                        }
                    });
            },
        };
        var ERRNO_CODES = {
            EPERM: 63,
            ENOENT: 44,
            ESRCH: 71,
            EINTR: 27,
            EIO: 29,
            ENXIO: 60,
            E2BIG: 1,
            ENOEXEC: 45,
            EBADF: 8,
            ECHILD: 12,
            EAGAIN: 6,
            EWOULDBLOCK: 6,
            ENOMEM: 48,
            EACCES: 2,
            EFAULT: 21,
            ENOTBLK: 105,
            EBUSY: 10,
            EEXIST: 20,
            EXDEV: 75,
            ENODEV: 43,
            ENOTDIR: 54,
            EISDIR: 31,
            EINVAL: 28,
            ENFILE: 41,
            EMFILE: 33,
            ENOTTY: 59,
            ETXTBSY: 74,
            EFBIG: 22,
            ENOSPC: 51,
            ESPIPE: 70,
            EROFS: 69,
            EMLINK: 34,
            EPIPE: 64,
            EDOM: 18,
            ERANGE: 68,
            ENOMSG: 49,
            EIDRM: 24,
            ECHRNG: 106,
            EL2NSYNC: 156,
            EL3HLT: 107,
            EL3RST: 108,
            ELNRNG: 109,
            EUNATCH: 110,
            ENOCSI: 111,
            EL2HLT: 112,
            EDEADLK: 16,
            ENOLCK: 46,
            EBADE: 113,
            EBADR: 114,
            EXFULL: 115,
            ENOANO: 104,
            EBADRQC: 103,
            EBADSLT: 102,
            EDEADLOCK: 16,
            EBFONT: 101,
            ENOSTR: 100,
            ENODATA: 116,
            ETIME: 117,
            ENOSR: 118,
            ENONET: 119,
            ENOPKG: 120,
            EREMOTE: 121,
            ENOLINK: 47,
            EADV: 122,
            ESRMNT: 123,
            ECOMM: 124,
            EPROTO: 65,
            EMULTIHOP: 36,
            EDOTDOT: 125,
            EBADMSG: 9,
            ENOTUNIQ: 126,
            EBADFD: 127,
            EREMCHG: 128,
            ELIBACC: 129,
            ELIBBAD: 130,
            ELIBSCN: 131,
            ELIBMAX: 132,
            ELIBEXEC: 133,
            ENOSYS: 52,
            ENOTEMPTY: 55,
            ENAMETOOLONG: 37,
            ELOOP: 32,
            EOPNOTSUPP: 138,
            EPFNOSUPPORT: 139,
            ECONNRESET: 15,
            ENOBUFS: 42,
            EAFNOSUPPORT: 5,
            EPROTOTYPE: 67,
            ENOTSOCK: 57,
            ENOPROTOOPT: 50,
            ESHUTDOWN: 140,
            ECONNREFUSED: 14,
            EADDRINUSE: 3,
            ECONNABORTED: 13,
            ENETUNREACH: 40,
            ENETDOWN: 38,
            ETIMEDOUT: 73,
            EHOSTDOWN: 142,
            EHOSTUNREACH: 23,
            EINPROGRESS: 26,
            EALREADY: 7,
            EDESTADDRREQ: 17,
            EMSGSIZE: 35,
            EPROTONOSUPPORT: 66,
            ESOCKTNOSUPPORT: 137,
            EADDRNOTAVAIL: 4,
            ENETRESET: 39,
            EISCONN: 30,
            ENOTCONN: 53,
            ETOOMANYREFS: 141,
            EUSERS: 136,
            EDQUOT: 19,
            ESTALE: 72,
            ENOTSUP: 138,
            ENOMEDIUM: 148,
            EILSEQ: 25,
            EOVERFLOW: 61,
            ECANCELED: 11,
            ENOTRECOVERABLE: 56,
            EOWNERDEAD: 62,
            ESTRPIPE: 135,
        };
        var NODEFS = {
            isWindows: false,
            staticInit: function () {
                NODEFS.isWindows = !!process.platform.match(/^win/);
                var flags = process["binding"]("constants");
                if (flags["fs"]) {
                    flags = flags["fs"];
                }
                NODEFS.flagsForNodeMap = {
                    1024: flags["O_APPEND"],
                    64: flags["O_CREAT"],
                    128: flags["O_EXCL"],
                    0: flags["O_RDONLY"],
                    2: flags["O_RDWR"],
                    4096: flags["O_SYNC"],
                    512: flags["O_TRUNC"],
                    1: flags["O_WRONLY"],
                };
            },
            bufferFrom: function (arrayBuffer) {
                return Buffer["alloc"] ? Buffer.from(arrayBuffer) : new Buffer(arrayBuffer);
            },
            convertNodeCode: function (e) {
                var code = e.code;
                assert(code in ERRNO_CODES);
                return ERRNO_CODES[code];
            },
            mount: function (mount) {
                assert(ENVIRONMENT_HAS_NODE);
                return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0);
            },
            createNode: function (parent, name, mode, dev) {
                if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
                    throw new FS.ErrnoError(28);
                }
                var node = FS.createNode(parent, name, mode);
                node.node_ops = NODEFS.node_ops;
                node.stream_ops = NODEFS.stream_ops;
                return node;
            },
            getMode: function (path) {
                var stat;
                try {
                    stat = fs.lstatSync(path);
                    if (NODEFS.isWindows) {
                        stat.mode = stat.mode | ((stat.mode & 292) >> 2);
                    }
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                }
                return stat.mode;
            },
            realPath: function (node) {
                var parts = [];
                while (node.parent !== node) {
                    parts.push(node.name);
                    node = node.parent;
                }
                parts.push(node.mount.opts.root);
                parts.reverse();
                return PATH.join.apply(null, parts);
            },
            flagsForNode: function (flags) {
                flags &= ~2097152;
                flags &= ~2048;
                flags &= ~32768;
                flags &= ~524288;
                var newFlags = 0;
                for (var k in NODEFS.flagsForNodeMap) {
                    if (flags & k) {
                        newFlags |= NODEFS.flagsForNodeMap[k];
                        flags ^= k;
                    }
                }
                if (!flags) {
                    return newFlags;
                } else {
                    throw new FS.ErrnoError(28);
                }
            },
            node_ops: {
                getattr: function (node) {
                    var path = NODEFS.realPath(node);
                    var stat;
                    try {
                        stat = fs.lstatSync(path);
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                    if (NODEFS.isWindows && !stat.blksize) {
                        stat.blksize = 4096;
                    }
                    if (NODEFS.isWindows && !stat.blocks) {
                        stat.blocks = ((stat.size + stat.blksize - 1) / stat.blksize) | 0;
                    }
                    return {
                        dev: stat.dev,
                        ino: stat.ino,
                        mode: stat.mode,
                        nlink: stat.nlink,
                        uid: stat.uid,
                        gid: stat.gid,
                        rdev: stat.rdev,
                        size: stat.size,
                        atime: stat.atime,
                        mtime: stat.mtime,
                        ctime: stat.ctime,
                        blksize: stat.blksize,
                        blocks: stat.blocks,
                    };
                },
                setattr: function (node, attr) {
                    var path = NODEFS.realPath(node);
                    try {
                        if (attr.mode !== undefined) {
                            fs.chmodSync(path, attr.mode);
                            node.mode = attr.mode;
                        }
                        if (attr.timestamp !== undefined) {
                            var date = new Date(attr.timestamp);
                            fs.utimesSync(path, date, date);
                        }
                        if (attr.size !== undefined) {
                            fs.truncateSync(path, attr.size);
                        }
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                },
                lookup: function (parent, name) {
                    var path = PATH.join2(NODEFS.realPath(parent), name);
                    var mode = NODEFS.getMode(path);
                    return NODEFS.createNode(parent, name, mode);
                },
                mknod: function (parent, name, mode, dev) {
                    var node = NODEFS.createNode(parent, name, mode, dev);
                    var path = NODEFS.realPath(node);
                    try {
                        if (FS.isDir(node.mode)) {
                            fs.mkdirSync(path, node.mode);
                        } else {
                            fs.writeFileSync(path, "", { mode: node.mode });
                        }
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                    return node;
                },
                rename: function (oldNode, newDir, newName) {
                    var oldPath = NODEFS.realPath(oldNode);
                    var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
                    try {
                        fs.renameSync(oldPath, newPath);
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                },
                unlink: function (parent, name) {
                    var path = PATH.join2(NODEFS.realPath(parent), name);
                    try {
                        fs.unlinkSync(path);
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                },
                rmdir: function (parent, name) {
                    var path = PATH.join2(NODEFS.realPath(parent), name);
                    try {
                        fs.rmdirSync(path);
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                },
                readdir: function (node) {
                    var path = NODEFS.realPath(node);
                    try {
                        return fs.readdirSync(path);
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                },
                symlink: function (parent, newName, oldPath) {
                    var newPath = PATH.join2(NODEFS.realPath(parent), newName);
                    try {
                        fs.symlinkSync(oldPath, newPath);
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                },
                readlink: function (node) {
                    var path = NODEFS.realPath(node);
                    try {
                        path = fs.readlinkSync(path);
                        path = NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root), path);
                        return path;
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                },
            },
            stream_ops: {
                open: function (stream) {
                    var path = NODEFS.realPath(stream.node);
                    try {
                        if (FS.isFile(stream.node.mode)) {
                            stream.nfd = fs.openSync(path, NODEFS.flagsForNode(stream.flags));
                        }
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                },
                close: function (stream) {
                    try {
                        if (FS.isFile(stream.node.mode) && stream.nfd) {
                            fs.closeSync(stream.nfd);
                        }
                    } catch (e) {
                        if (!e.code) throw e;
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                },
                read: function (stream, buffer, offset, length, position) {
                    if (length === 0) return 0;
                    try {
                        return fs.readSync(stream.nfd, NODEFS.bufferFrom(buffer.buffer), offset, length, position);
                    } catch (e) {
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                },
                write: function (stream, buffer, offset, length, position) {
                    try {
                        return fs.writeSync(stream.nfd, NODEFS.bufferFrom(buffer.buffer), offset, length, position);
                    } catch (e) {
                        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                    }
                },
                llseek: function (stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position;
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            try {
                                var stat = fs.fstatSync(stream.nfd);
                                position += stat.size;
                            } catch (e) {
                                throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
                            }
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(28);
                    }
                    return position;
                },
            },
        };
        var WORKERFS = {
            DIR_MODE: 16895,
            FILE_MODE: 33279,
            reader: null,
            mount: function (mount) {
                assert(ENVIRONMENT_IS_WORKER);
                if (!WORKERFS.reader) WORKERFS.reader = new FileReaderSync();
                var root = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0);
                var createdParents = {};
                function ensureParent(path) {
                    var parts = path.split("/");
                    var parent = root;
                    for (var i = 0; i < parts.length - 1; i++) {
                        var curr = parts.slice(0, i + 1).join("/");
                        if (!createdParents[curr]) {
                            createdParents[curr] = WORKERFS.createNode(parent, parts[i], WORKERFS.DIR_MODE, 0);
                        }
                        parent = createdParents[curr];
                    }
                    return parent;
                }
                function base(path) {
                    var parts = path.split("/");
                    return parts[parts.length - 1];
                }
                Array.prototype.forEach.call(mount.opts["files"] || [], function (file) {
                    WORKERFS.createNode(
                        ensureParent(file.name),
                        base(file.name),
                        WORKERFS.FILE_MODE,
                        0,
                        file,
                        file.lastModifiedDate
                    );
                });
                (mount.opts["blobs"] || []).forEach(function (obj) {
                    WORKERFS.createNode(
                        ensureParent(obj["name"]),
                        base(obj["name"]),
                        WORKERFS.FILE_MODE,
                        0,
                        obj["data"]
                    );
                });
                (mount.opts["packages"] || []).forEach(function (pack) {
                    pack["metadata"].files.forEach(function (file) {
                        var name = file.filename.substr(1);
                        WORKERFS.createNode(
                            ensureParent(name),
                            base(name),
                            WORKERFS.FILE_MODE,
                            0,
                            pack["blob"].slice(file.start, file.end)
                        );
                    });
                });
                return root;
            },
            createNode: function (parent, name, mode, dev, contents, mtime) {
                var node = FS.createNode(parent, name, mode);
                node.mode = mode;
                node.node_ops = WORKERFS.node_ops;
                node.stream_ops = WORKERFS.stream_ops;
                node.timestamp = (mtime || new Date()).getTime();
                assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
                if (mode === WORKERFS.FILE_MODE) {
                    node.size = contents.size;
                    node.contents = contents;
                } else {
                    node.size = 4096;
                    node.contents = {};
                }
                if (parent) {
                    parent.contents[name] = node;
                }
                return node;
            },
            node_ops: {
                getattr: function (node) {
                    return {
                        dev: 1,
                        ino: undefined,
                        mode: node.mode,
                        nlink: 1,
                        uid: 0,
                        gid: 0,
                        rdev: undefined,
                        size: node.size,
                        atime: new Date(node.timestamp),
                        mtime: new Date(node.timestamp),
                        ctime: new Date(node.timestamp),
                        blksize: 4096,
                        blocks: Math.ceil(node.size / 4096),
                    };
                },
                setattr: function (node, attr) {
                    if (attr.mode !== undefined) {
                        node.mode = attr.mode;
                    }
                    if (attr.timestamp !== undefined) {
                        node.timestamp = attr.timestamp;
                    }
                },
                lookup: function (parent, name) {
                    throw new FS.ErrnoError(44);
                },
                mknod: function (parent, name, mode, dev) {
                    throw new FS.ErrnoError(63);
                },
                rename: function (oldNode, newDir, newName) {
                    throw new FS.ErrnoError(63);
                },
                unlink: function (parent, name) {
                    throw new FS.ErrnoError(63);
                },
                rmdir: function (parent, name) {
                    throw new FS.ErrnoError(63);
                },
                readdir: function (node) {
                    var entries = [".", ".."];
                    for (var key in node.contents) {
                        if (!node.contents.hasOwnProperty(key)) {
                            continue;
                        }
                        entries.push(key);
                    }
                    return entries;
                },
                symlink: function (parent, newName, oldPath) {
                    throw new FS.ErrnoError(63);
                },
                readlink: function (node) {
                    throw new FS.ErrnoError(63);
                },
            },
            stream_ops: {
                read: function (stream, buffer, offset, length, position) {
                    if (position >= stream.node.size) return 0;
                    var chunk = stream.node.contents.slice(position, position + length);
                    var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
                    buffer.set(new Uint8Array(ab), offset);
                    return chunk.size;
                },
                write: function (stream, buffer, offset, length, position) {
                    throw new FS.ErrnoError(29);
                },
                llseek: function (stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position;
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            position += stream.node.size;
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(28);
                    }
                    return position;
                },
            },
        };
        var FS = {
            root: null,
            mounts: [],
            devices: {},
            streams: [],
            nextInode: 1,
            nameTable: null,
            currentPath: "/",
            initialized: false,
            ignorePermissions: true,
            trackingDelegate: {},
            tracking: { openFlags: { READ: 1, WRITE: 2 } },
            ErrnoError: null,
            genericErrors: {},
            filesystems: null,
            syncFSRequests: 0,
            handleFSError: function (e) {
                if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
                return ___setErrNo(e.errno);
            },
            lookupPath: function (path, opts) {
                path = PATH_FS.resolve(FS.cwd(), path);
                opts = opts || {};
                if (!path) return { path: "", node: null };
                var defaults = { follow_mount: true, recurse_count: 0 };
                for (var key in defaults) {
                    if (opts[key] === undefined) {
                        opts[key] = defaults[key];
                    }
                }
                if (opts.recurse_count > 8) {
                    throw new FS.ErrnoError(32);
                }
                var parts = PATH.normalizeArray(
                    path.split("/").filter(function (p) {
                        return !!p;
                    }),
                    false
                );
                var current = FS.root;
                var current_path = "/";
                for (var i = 0; i < parts.length; i++) {
                    var islast = i === parts.length - 1;
                    if (islast && opts.parent) {
                        break;
                    }
                    current = FS.lookupNode(current, parts[i]);
                    current_path = PATH.join2(current_path, parts[i]);
                    if (FS.isMountpoint(current)) {
                        if (!islast || (islast && opts.follow_mount)) {
                            current = current.mounted.root;
                        }
                    }
                    if (!islast || opts.follow) {
                        var count = 0;
                        while (FS.isLink(current.mode)) {
                            var link = FS.readlink(current_path);
                            current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                            var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
                            current = lookup.node;
                            if (count++ > 40) {
                                throw new FS.ErrnoError(32);
                            }
                        }
                    }
                }
                return { path: current_path, node: current };
            },
            getPath: function (node) {
                var path;
                while (true) {
                    if (FS.isRoot(node)) {
                        var mount = node.mount.mountpoint;
                        if (!path) return mount;
                        return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path;
                    }
                    path = path ? node.name + "/" + path : node.name;
                    node = node.parent;
                }
            },
            hashName: function (parentid, name) {
                var hash = 0;
                for (var i = 0; i < name.length; i++) {
                    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
                }
                return ((parentid + hash) >>> 0) % FS.nameTable.length;
            },
            hashAddNode: function (node) {
                var hash = FS.hashName(node.parent.id, node.name);
                node.name_next = FS.nameTable[hash];
                FS.nameTable[hash] = node;
            },
            hashRemoveNode: function (node) {
                var hash = FS.hashName(node.parent.id, node.name);
                if (FS.nameTable[hash] === node) {
                    FS.nameTable[hash] = node.name_next;
                } else {
                    var current = FS.nameTable[hash];
                    while (current) {
                        if (current.name_next === node) {
                            current.name_next = node.name_next;
                            break;
                        }
                        current = current.name_next;
                    }
                }
            },
            lookupNode: function (parent, name) {
                var err = FS.mayLookup(parent);
                if (err) {
                    throw new FS.ErrnoError(err, parent);
                }
                var hash = FS.hashName(parent.id, name);
                for (var node = FS.nameTable[hash]; node; node = node.name_next) {
                    var nodeName = node.name;
                    if (node.parent.id === parent.id && nodeName === name) {
                        return node;
                    }
                }
                return FS.lookup(parent, name);
            },
            createNode: function (parent, name, mode, rdev) {
                if (!FS.FSNode) {
                    FS.FSNode = function (parent, name, mode, rdev) {
                        if (!parent) {
                            parent = this;
                        }
                        this.parent = parent;
                        this.mount = parent.mount;
                        this.mounted = null;
                        this.id = FS.nextInode++;
                        this.name = name;
                        this.mode = mode;
                        this.node_ops = {};
                        this.stream_ops = {};
                        this.rdev = rdev;
                    };
                    FS.FSNode.prototype = {};
                    var readMode = 292 | 73;
                    var writeMode = 146;
                    Object.defineProperties(FS.FSNode.prototype, {
                        read: {
                            get: function () {
                                return (this.mode & readMode) === readMode;
                            },
                            set: function (val) {
                                val ? (this.mode |= readMode) : (this.mode &= ~readMode);
                            },
                        },
                        write: {
                            get: function () {
                                return (this.mode & writeMode) === writeMode;
                            },
                            set: function (val) {
                                val ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
                            },
                        },
                        isFolder: {
                            get: function () {
                                return FS.isDir(this.mode);
                            },
                        },
                        isDevice: {
                            get: function () {
                                return FS.isChrdev(this.mode);
                            },
                        },
                    });
                }
                var node = new FS.FSNode(parent, name, mode, rdev);
                FS.hashAddNode(node);
                return node;
            },
            destroyNode: function (node) {
                FS.hashRemoveNode(node);
            },
            isRoot: function (node) {
                return node === node.parent;
            },
            isMountpoint: function (node) {
                return !!node.mounted;
            },
            isFile: function (mode) {
                return (mode & 61440) === 32768;
            },
            isDir: function (mode) {
                return (mode & 61440) === 16384;
            },
            isLink: function (mode) {
                return (mode & 61440) === 40960;
            },
            isChrdev: function (mode) {
                return (mode & 61440) === 8192;
            },
            isBlkdev: function (mode) {
                return (mode & 61440) === 24576;
            },
            isFIFO: function (mode) {
                return (mode & 61440) === 4096;
            },
            isSocket: function (mode) {
                return (mode & 49152) === 49152;
            },
            flagModes: {
                r: 0,
                rs: 1052672,
                "r+": 2,
                w: 577,
                wx: 705,
                xw: 705,
                "w+": 578,
                "wx+": 706,
                "xw+": 706,
                a: 1089,
                ax: 1217,
                xa: 1217,
                "a+": 1090,
                "ax+": 1218,
                "xa+": 1218,
            },
            modeStringToFlags: function (str) {
                var flags = FS.flagModes[str];
                if (typeof flags === "undefined") {
                    throw new Error("Unknown file open mode: " + str);
                }
                return flags;
            },
            flagsToPermissionString: function (flag) {
                var perms = ["r", "w", "rw"][flag & 3];
                if (flag & 512) {
                    perms += "w";
                }
                return perms;
            },
            nodePermissions: function (node, perms) {
                if (FS.ignorePermissions) {
                    return 0;
                }
                if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
                    return 2;
                } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
                    return 2;
                } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
                    return 2;
                }
                return 0;
            },
            mayLookup: function (dir) {
                var err = FS.nodePermissions(dir, "x");
                if (err) return err;
                if (!dir.node_ops.lookup) return 2;
                return 0;
            },
            mayCreate: function (dir, name) {
                try {
                    var node = FS.lookupNode(dir, name);
                    return 20;
                } catch (e) {}
                return FS.nodePermissions(dir, "wx");
            },
            mayDelete: function (dir, name, isdir) {
                var node;
                try {
                    node = FS.lookupNode(dir, name);
                } catch (e) {
                    return e.errno;
                }
                var err = FS.nodePermissions(dir, "wx");
                if (err) {
                    return err;
                }
                if (isdir) {
                    if (!FS.isDir(node.mode)) {
                        return 54;
                    }
                    if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                        return 10;
                    }
                } else {
                    if (FS.isDir(node.mode)) {
                        return 31;
                    }
                }
                return 0;
            },
            mayOpen: function (node, flags) {
                if (!node) {
                    return 44;
                }
                if (FS.isLink(node.mode)) {
                    return 32;
                } else if (FS.isDir(node.mode)) {
                    if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                        return 31;
                    }
                }
                return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
            },
            MAX_OPEN_FDS: 4096,
            nextfd: function (fd_start, fd_end) {
                fd_start = fd_start || 0;
                fd_end = fd_end || FS.MAX_OPEN_FDS;
                for (var fd = fd_start; fd <= fd_end; fd++) {
                    if (!FS.streams[fd]) {
                        return fd;
                    }
                }
                throw new FS.ErrnoError(33);
            },
            getStream: function (fd) {
                return FS.streams[fd];
            },
            createStream: function (stream, fd_start, fd_end) {
                if (!FS.FSStream) {
                    FS.FSStream = function () {};
                    FS.FSStream.prototype = {};
                    Object.defineProperties(FS.FSStream.prototype, {
                        object: {
                            get: function () {
                                return this.node;
                            },
                            set: function (val) {
                                this.node = val;
                            },
                        },
                        isRead: {
                            get: function () {
                                return (this.flags & 2097155) !== 1;
                            },
                        },
                        isWrite: {
                            get: function () {
                                return (this.flags & 2097155) !== 0;
                            },
                        },
                        isAppend: {
                            get: function () {
                                return this.flags & 1024;
                            },
                        },
                    });
                }
                var newStream = new FS.FSStream();
                for (var p in stream) {
                    newStream[p] = stream[p];
                }
                stream = newStream;
                var fd = FS.nextfd(fd_start, fd_end);
                stream.fd = fd;
                FS.streams[fd] = stream;
                return stream;
            },
            closeStream: function (fd) {
                FS.streams[fd] = null;
            },
            chrdev_stream_ops: {
                open: function (stream) {
                    var device = FS.getDevice(stream.node.rdev);
                    stream.stream_ops = device.stream_ops;
                    if (stream.stream_ops.open) {
                        stream.stream_ops.open(stream);
                    }
                },
                llseek: function () {
                    throw new FS.ErrnoError(70);
                },
            },
            major: function (dev) {
                return dev >> 8;
            },
            minor: function (dev) {
                return dev & 255;
            },
            makedev: function (ma, mi) {
                return (ma << 8) | mi;
            },
            registerDevice: function (dev, ops) {
                FS.devices[dev] = { stream_ops: ops };
            },
            getDevice: function (dev) {
                return FS.devices[dev];
            },
            getMounts: function (mount) {
                var mounts = [];
                var check = [mount];
                while (check.length) {
                    var m = check.pop();
                    mounts.push(m);
                    check.push.apply(check, m.mounts);
                }
                return mounts;
            },
            syncfs: function (populate, callback) {
                if (typeof populate === "function") {
                    callback = populate;
                    populate = false;
                }
                FS.syncFSRequests++;
                if (FS.syncFSRequests > 1) {
                    console.log(
                        "warning: " +
                            FS.syncFSRequests +
                            " FS.syncfs operations in flight at once, probably just doing extra work"
                    );
                }
                var mounts = FS.getMounts(FS.root.mount);
                var completed = 0;
                function doCallback(err) {
                    FS.syncFSRequests--;
                    return callback(err);
                }
                function done(err) {
                    if (err) {
                        if (!done.errored) {
                            done.errored = true;
                            return doCallback(err);
                        }
                        return;
                    }
                    if (++completed >= mounts.length) {
                        doCallback(null);
                    }
                }
                mounts.forEach(function (mount) {
                    if (!mount.type.syncfs) {
                        return done(null);
                    }
                    mount.type.syncfs(mount, populate, done);
                });
            },
            mount: function (type, opts, mountpoint) {
                var root = mountpoint === "/";
                var pseudo = !mountpoint;
                var node;
                if (root && FS.root) {
                    throw new FS.ErrnoError(10);
                } else if (!root && !pseudo) {
                    var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
                    mountpoint = lookup.path;
                    node = lookup.node;
                    if (FS.isMountpoint(node)) {
                        throw new FS.ErrnoError(10);
                    }
                    if (!FS.isDir(node.mode)) {
                        throw new FS.ErrnoError(54);
                    }
                }
                var mount = { type: type, opts: opts, mountpoint: mountpoint, mounts: [] };
                var mountRoot = type.mount(mount);
                mountRoot.mount = mount;
                mount.root = mountRoot;
                if (root) {
                    FS.root = mountRoot;
                } else if (node) {
                    node.mounted = mount;
                    if (node.mount) {
                        node.mount.mounts.push(mount);
                    }
                }
                return mountRoot;
            },
            unmount: function (mountpoint) {
                var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
                if (!FS.isMountpoint(lookup.node)) {
                    throw new FS.ErrnoError(28);
                }
                var node = lookup.node;
                var mount = node.mounted;
                var mounts = FS.getMounts(mount);
                Object.keys(FS.nameTable).forEach(function (hash) {
                    var current = FS.nameTable[hash];
                    while (current) {
                        var next = current.name_next;
                        if (mounts.indexOf(current.mount) !== -1) {
                            FS.destroyNode(current);
                        }
                        current = next;
                    }
                });
                node.mounted = null;
                var idx = node.mount.mounts.indexOf(mount);
                node.mount.mounts.splice(idx, 1);
            },
            lookup: function (parent, name) {
                return parent.node_ops.lookup(parent, name);
            },
            mknod: function (path, mode, dev) {
                var lookup = FS.lookupPath(path, { parent: true });
                var parent = lookup.node;
                var name = PATH.basename(path);
                if (!name || name === "." || name === "..") {
                    throw new FS.ErrnoError(28);
                }
                var err = FS.mayCreate(parent, name);
                if (err) {
                    throw new FS.ErrnoError(err);
                }
                if (!parent.node_ops.mknod) {
                    throw new FS.ErrnoError(63);
                }
                return parent.node_ops.mknod(parent, name, mode, dev);
            },
            create: function (path, mode) {
                mode = mode !== undefined ? mode : 438;
                mode &= 4095;
                mode |= 32768;
                return FS.mknod(path, mode, 0);
            },
            mkdir: function (path, mode) {
                mode = mode !== undefined ? mode : 511;
                mode &= 511 | 512;
                mode |= 16384;
                return FS.mknod(path, mode, 0);
            },
            mkdirTree: function (path, mode) {
                var dirs = path.split("/");
                var d = "";
                for (var i = 0; i < dirs.length; ++i) {
                    if (!dirs[i]) continue;
                    d += "/" + dirs[i];
                    try {
                        FS.mkdir(d, mode);
                    } catch (e) {
                        if (e.errno != 20) throw e;
                    }
                }
            },
            mkdev: function (path, mode, dev) {
                if (typeof dev === "undefined") {
                    dev = mode;
                    mode = 438;
                }
                mode |= 8192;
                return FS.mknod(path, mode, dev);
            },
            symlink: function (oldpath, newpath) {
                if (!PATH_FS.resolve(oldpath)) {
                    throw new FS.ErrnoError(44);
                }
                var lookup = FS.lookupPath(newpath, { parent: true });
                var parent = lookup.node;
                if (!parent) {
                    throw new FS.ErrnoError(44);
                }
                var newname = PATH.basename(newpath);
                var err = FS.mayCreate(parent, newname);
                if (err) {
                    throw new FS.ErrnoError(err);
                }
                if (!parent.node_ops.symlink) {
                    throw new FS.ErrnoError(63);
                }
                return parent.node_ops.symlink(parent, newname, oldpath);
            },
            rename: function (old_path, new_path) {
                var old_dirname = PATH.dirname(old_path);
                var new_dirname = PATH.dirname(new_path);
                var old_name = PATH.basename(old_path);
                var new_name = PATH.basename(new_path);
                var lookup, old_dir, new_dir;
                try {
                    lookup = FS.lookupPath(old_path, { parent: true });
                    old_dir = lookup.node;
                    lookup = FS.lookupPath(new_path, { parent: true });
                    new_dir = lookup.node;
                } catch (e) {
                    throw new FS.ErrnoError(10);
                }
                if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
                if (old_dir.mount !== new_dir.mount) {
                    throw new FS.ErrnoError(75);
                }
                var old_node = FS.lookupNode(old_dir, old_name);
                var relative = PATH_FS.relative(old_path, new_dirname);
                if (relative.charAt(0) !== ".") {
                    throw new FS.ErrnoError(28);
                }
                relative = PATH_FS.relative(new_path, old_dirname);
                if (relative.charAt(0) !== ".") {
                    throw new FS.ErrnoError(55);
                }
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {}
                if (old_node === new_node) {
                    return;
                }
                var isdir = FS.isDir(old_node.mode);
                var err = FS.mayDelete(old_dir, old_name, isdir);
                if (err) {
                    throw new FS.ErrnoError(err);
                }
                err = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
                if (err) {
                    throw new FS.ErrnoError(err);
                }
                if (!old_dir.node_ops.rename) {
                    throw new FS.ErrnoError(63);
                }
                if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
                    throw new FS.ErrnoError(10);
                }
                if (new_dir !== old_dir) {
                    err = FS.nodePermissions(old_dir, "w");
                    if (err) {
                        throw new FS.ErrnoError(err);
                    }
                }
                try {
                    if (FS.trackingDelegate["willMovePath"]) {
                        FS.trackingDelegate["willMovePath"](old_path, new_path);
                    }
                } catch (e) {
                    console.log(
                        "FS.trackingDelegate['willMovePath']('" +
                            old_path +
                            "', '" +
                            new_path +
                            "') threw an exception: " +
                            e.message
                    );
                }
                FS.hashRemoveNode(old_node);
                try {
                    old_dir.node_ops.rename(old_node, new_dir, new_name);
                } catch (e) {
                    throw e;
                } finally {
                    FS.hashAddNode(old_node);
                }
                try {
                    if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path);
                } catch (e) {
                    console.log(
                        "FS.trackingDelegate['onMovePath']('" +
                            old_path +
                            "', '" +
                            new_path +
                            "') threw an exception: " +
                            e.message
                    );
                }
            },
            rmdir: function (path) {
                var lookup = FS.lookupPath(path, { parent: true });
                var parent = lookup.node;
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var err = FS.mayDelete(parent, name, true);
                if (err) {
                    throw new FS.ErrnoError(err);
                }
                if (!parent.node_ops.rmdir) {
                    throw new FS.ErrnoError(63);
                }
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(10);
                }
                try {
                    if (FS.trackingDelegate["willDeletePath"]) {
                        FS.trackingDelegate["willDeletePath"](path);
                    }
                } catch (e) {
                    console.log(
                        "FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message
                    );
                }
                parent.node_ops.rmdir(parent, name);
                FS.destroyNode(node);
                try {
                    if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
                } catch (e) {
                    console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
                }
            },
            readdir: function (path) {
                var lookup = FS.lookupPath(path, { follow: true });
                var node = lookup.node;
                if (!node.node_ops.readdir) {
                    throw new FS.ErrnoError(54);
                }
                return node.node_ops.readdir(node);
            },
            unlink: function (path) {
                var lookup = FS.lookupPath(path, { parent: true });
                var parent = lookup.node;
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var err = FS.mayDelete(parent, name, false);
                if (err) {
                    throw new FS.ErrnoError(err);
                }
                if (!parent.node_ops.unlink) {
                    throw new FS.ErrnoError(63);
                }
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(10);
                }
                try {
                    if (FS.trackingDelegate["willDeletePath"]) {
                        FS.trackingDelegate["willDeletePath"](path);
                    }
                } catch (e) {
                    console.log(
                        "FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message
                    );
                }
                parent.node_ops.unlink(parent, name);
                FS.destroyNode(node);
                try {
                    if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
                } catch (e) {
                    console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
                }
            },
            readlink: function (path) {
                var lookup = FS.lookupPath(path);
                var link = lookup.node;
                if (!link) {
                    throw new FS.ErrnoError(44);
                }
                if (!link.node_ops.readlink) {
                    throw new FS.ErrnoError(28);
                }
                return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
            },
            stat: function (path, dontFollow) {
                var lookup = FS.lookupPath(path, { follow: !dontFollow });
                var node = lookup.node;
                if (!node) {
                    throw new FS.ErrnoError(44);
                }
                if (!node.node_ops.getattr) {
                    throw new FS.ErrnoError(63);
                }
                return node.node_ops.getattr(node);
            },
            lstat: function (path) {
                return FS.stat(path, true);
            },
            chmod: function (path, mode, dontFollow) {
                var node;
                if (typeof path === "string") {
                    var lookup = FS.lookupPath(path, { follow: !dontFollow });
                    node = lookup.node;
                } else {
                    node = path;
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(63);
                }
                node.node_ops.setattr(node, { mode: (mode & 4095) | (node.mode & ~4095), timestamp: Date.now() });
            },
            lchmod: function (path, mode) {
                FS.chmod(path, mode, true);
            },
            fchmod: function (fd, mode) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(8);
                }
                FS.chmod(stream.node, mode);
            },
            chown: function (path, uid, gid, dontFollow) {
                var node;
                if (typeof path === "string") {
                    var lookup = FS.lookupPath(path, { follow: !dontFollow });
                    node = lookup.node;
                } else {
                    node = path;
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(63);
                }
                node.node_ops.setattr(node, { timestamp: Date.now() });
            },
            lchown: function (path, uid, gid) {
                FS.chown(path, uid, gid, true);
            },
            fchown: function (fd, uid, gid) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(8);
                }
                FS.chown(stream.node, uid, gid);
            },
            truncate: function (path, len) {
                if (len < 0) {
                    throw new FS.ErrnoError(28);
                }
                var node;
                if (typeof path === "string") {
                    var lookup = FS.lookupPath(path, { follow: true });
                    node = lookup.node;
                } else {
                    node = path;
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(63);
                }
                if (FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(31);
                }
                if (!FS.isFile(node.mode)) {
                    throw new FS.ErrnoError(28);
                }
                var err = FS.nodePermissions(node, "w");
                if (err) {
                    throw new FS.ErrnoError(err);
                }
                node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
            },
            ftruncate: function (fd, len) {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(8);
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(28);
                }
                FS.truncate(stream.node, len);
            },
            utime: function (path, atime, mtime) {
                var lookup = FS.lookupPath(path, { follow: true });
                var node = lookup.node;
                node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
            },
            open: function (path, flags, mode, fd_start, fd_end) {
                if (path === "") {
                    throw new FS.ErrnoError(44);
                }
                flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
                mode = typeof mode === "undefined" ? 438 : mode;
                if (flags & 64) {
                    mode = (mode & 4095) | 32768;
                } else {
                    mode = 0;
                }
                var node;
                if (typeof path === "object") {
                    node = path;
                } else {
                    path = PATH.normalize(path);
                    try {
                        var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
                        node = lookup.node;
                    } catch (e) {}
                }
                var created = false;
                if (flags & 64) {
                    if (node) {
                        if (flags & 128) {
                            throw new FS.ErrnoError(20);
                        }
                    } else {
                        node = FS.mknod(path, mode, 0);
                        created = true;
                    }
                }
                if (!node) {
                    throw new FS.ErrnoError(44);
                }
                if (FS.isChrdev(node.mode)) {
                    flags &= ~512;
                }
                if (flags & 65536 && !FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(54);
                }
                if (!created) {
                    var err = FS.mayOpen(node, flags);
                    if (err) {
                        throw new FS.ErrnoError(err);
                    }
                }
                if (flags & 512) {
                    FS.truncate(node, 0);
                }
                flags &= ~(128 | 512);
                var stream = FS.createStream(
                    {
                        node: node,
                        path: FS.getPath(node),
                        flags: flags,
                        seekable: true,
                        position: 0,
                        stream_ops: node.stream_ops,
                        ungotten: [],
                        error: false,
                    },
                    fd_start,
                    fd_end
                );
                if (stream.stream_ops.open) {
                    stream.stream_ops.open(stream);
                }
                if (Module["logReadFiles"] && !(flags & 1)) {
                    if (!FS.readFiles) FS.readFiles = {};
                    if (!(path in FS.readFiles)) {
                        FS.readFiles[path] = 1;
                        console.log("FS.trackingDelegate error on read file: " + path);
                    }
                }
                try {
                    if (FS.trackingDelegate["onOpenFile"]) {
                        var trackingFlags = 0;
                        if ((flags & 2097155) !== 1) {
                            trackingFlags |= FS.tracking.openFlags.READ;
                        }
                        if ((flags & 2097155) !== 0) {
                            trackingFlags |= FS.tracking.openFlags.WRITE;
                        }
                        FS.trackingDelegate["onOpenFile"](path, trackingFlags);
                    }
                } catch (e) {
                    console.log(
                        "FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message
                    );
                }
                return stream;
            },
            close: function (stream) {
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if (stream.getdents) stream.getdents = null;
                try {
                    if (stream.stream_ops.close) {
                        stream.stream_ops.close(stream);
                    }
                } catch (e) {
                    throw e;
                } finally {
                    FS.closeStream(stream.fd);
                }
                stream.fd = null;
            },
            isClosed: function (stream) {
                return stream.fd === null;
            },
            llseek: function (stream, offset, whence) {
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if (!stream.seekable || !stream.stream_ops.llseek) {
                    throw new FS.ErrnoError(70);
                }
                if (whence != 0 && whence != 1 && whence != 2) {
                    throw new FS.ErrnoError(28);
                }
                stream.position = stream.stream_ops.llseek(stream, offset, whence);
                stream.ungotten = [];
                return stream.position;
            },
            read: function (stream, buffer, offset, length, position) {
                if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(28);
                }
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(8);
                }
                if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(31);
                }
                if (!stream.stream_ops.read) {
                    throw new FS.ErrnoError(28);
                }
                var seeking = typeof position !== "undefined";
                if (!seeking) {
                    position = stream.position;
                } else if (!stream.seekable) {
                    throw new FS.ErrnoError(70);
                }
                var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
                if (!seeking) stream.position += bytesRead;
                return bytesRead;
            },
            write: function (stream, buffer, offset, length, position, canOwn) {
                if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(28);
                }
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(8);
                }
                if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(31);
                }
                if (!stream.stream_ops.write) {
                    throw new FS.ErrnoError(28);
                }
                if (stream.flags & 1024) {
                    FS.llseek(stream, 0, 2);
                }
                var seeking = typeof position !== "undefined";
                if (!seeking) {
                    position = stream.position;
                } else if (!stream.seekable) {
                    throw new FS.ErrnoError(70);
                }
                var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
                if (!seeking) stream.position += bytesWritten;
                try {
                    if (stream.path && FS.trackingDelegate["onWriteToFile"])
                        FS.trackingDelegate["onWriteToFile"](stream.path);
                } catch (e) {
                    console.log(
                        "FS.trackingDelegate['onWriteToFile']('" + stream.path + "') threw an exception: " + e.message
                    );
                }
                return bytesWritten;
            },
            allocate: function (stream, offset, length) {
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if (offset < 0 || length <= 0) {
                    throw new FS.ErrnoError(28);
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(8);
                }
                if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(43);
                }
                if (!stream.stream_ops.allocate) {
                    throw new FS.ErrnoError(138);
                }
                stream.stream_ops.allocate(stream, offset, length);
            },
            mmap: function (stream, buffer, offset, length, position, prot, flags) {
                if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
                    throw new FS.ErrnoError(2);
                }
                if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(2);
                }
                if (!stream.stream_ops.mmap) {
                    throw new FS.ErrnoError(43);
                }
                return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
            },
            msync: function (stream, buffer, offset, length, mmapFlags) {
                if (!stream || !stream.stream_ops.msync) {
                    return 0;
                }
                return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
            },
            munmap: function (stream) {
                return 0;
            },
            ioctl: function (stream, cmd, arg) {
                if (!stream.stream_ops.ioctl) {
                    throw new FS.ErrnoError(59);
                }
                return stream.stream_ops.ioctl(stream, cmd, arg);
            },
            readFile: function (path, opts) {
                opts = opts || {};
                opts.flags = opts.flags || "r";
                opts.encoding = opts.encoding || "binary";
                if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
                    throw new Error('Invalid encoding type "' + opts.encoding + '"');
                }
                var ret;
                var stream = FS.open(path, opts.flags);
                var stat = FS.stat(path);
                var length = stat.size;
                var buf = new Uint8Array(length);
                FS.read(stream, buf, 0, length, 0);
                if (opts.encoding === "utf8") {
                    ret = UTF8ArrayToString(buf, 0);
                } else if (opts.encoding === "binary") {
                    ret = buf;
                }
                FS.close(stream);
                return ret;
            },
            writeFile: function (path, data, opts) {
                opts = opts || {};
                opts.flags = opts.flags || "w";
                var stream = FS.open(path, opts.flags, opts.mode);
                if (typeof data === "string") {
                    var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
                    var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
                    FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
                } else if (ArrayBuffer.isView(data)) {
                    FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
                } else {
                    throw new Error("Unsupported data type");
                }
                FS.close(stream);
            },
            cwd: function () {
                return FS.currentPath;
            },
            chdir: function (path) {
                var lookup = FS.lookupPath(path, { follow: true });
                if (lookup.node === null) {
                    throw new FS.ErrnoError(44);
                }
                if (!FS.isDir(lookup.node.mode)) {
                    throw new FS.ErrnoError(54);
                }
                var err = FS.nodePermissions(lookup.node, "x");
                if (err) {
                    throw new FS.ErrnoError(err);
                }
                FS.currentPath = lookup.path;
            },
            createDefaultDirectories: function () {
                FS.mkdir("/tmp");
                FS.mkdir("/home");
                FS.mkdir("/home/web_user");
            },
            createDefaultDevices: function () {
                FS.mkdir("/dev");
                FS.registerDevice(FS.makedev(1, 3), {
                    read: function () {
                        return 0;
                    },
                    write: function (stream, buffer, offset, length, pos) {
                        return length;
                    },
                });
                FS.mkdev("/dev/null", FS.makedev(1, 3));
                TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
                TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
                FS.mkdev("/dev/tty", FS.makedev(5, 0));
                FS.mkdev("/dev/tty1", FS.makedev(6, 0));
                var random_device;
                if (typeof crypto === "object" && typeof crypto["getRandomValues"] === "function") {
                    var randomBuffer = new Uint8Array(1);
                    random_device = function () {
                        crypto.getRandomValues(randomBuffer);
                        return randomBuffer[0];
                    };
                } else if (ENVIRONMENT_IS_NODE) {
                    try {
                        var crypto_module = require("crypto");
                        random_device = function () {
                            return crypto_module["randomBytes"](1)[0];
                        };
                    } catch (e) {}
                } else {
                }
                if (!random_device) {
                    random_device = function () {
                        abort("random_device");
                    };
                }
                FS.createDevice("/dev", "random", random_device);
                FS.createDevice("/dev", "urandom", random_device);
                FS.mkdir("/dev/shm");
                FS.mkdir("/dev/shm/tmp");
            },
            createSpecialDirectories: function () {
                FS.mkdir("/proc");
                FS.mkdir("/proc/self");
                FS.mkdir("/proc/self/fd");
                FS.mount(
                    {
                        mount: function () {
                            var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
                            node.node_ops = {
                                lookup: function (parent, name) {
                                    var fd = +name;
                                    var stream = FS.getStream(fd);
                                    if (!stream) throw new FS.ErrnoError(8);
                                    var ret = {
                                        parent: null,
                                        mount: { mountpoint: "fake" },
                                        node_ops: {
                                            readlink: function () {
                                                return stream.path;
                                            },
                                        },
                                    };
                                    ret.parent = ret;
                                    return ret;
                                },
                            };
                            return node;
                        },
                    },
                    {},
                    "/proc/self/fd"
                );
            },
            createStandardStreams: function () {
                if (Module["stdin"]) {
                    FS.createDevice("/dev", "stdin", Module["stdin"]);
                } else {
                    FS.symlink("/dev/tty", "/dev/stdin");
                }
                if (Module["stdout"]) {
                    FS.createDevice("/dev", "stdout", null, Module["stdout"]);
                } else {
                    FS.symlink("/dev/tty", "/dev/stdout");
                }
                if (Module["stderr"]) {
                    FS.createDevice("/dev", "stderr", null, Module["stderr"]);
                } else {
                    FS.symlink("/dev/tty1", "/dev/stderr");
                }
                var stdin = FS.open("/dev/stdin", "r");
                var stdout = FS.open("/dev/stdout", "w");
                var stderr = FS.open("/dev/stderr", "w");
            },
            ensureErrnoError: function () {
                if (FS.ErrnoError) return;
                FS.ErrnoError = function ErrnoError(errno, node) {
                    this.node = node;
                    this.setErrno = function (errno) {
                        this.errno = errno;
                    };
                    this.setErrno(errno);
                    this.message = "FS error";
                };
                FS.ErrnoError.prototype = new Error();
                FS.ErrnoError.prototype.constructor = FS.ErrnoError;
                [44].forEach(function (code) {
                    FS.genericErrors[code] = new FS.ErrnoError(code);
                    FS.genericErrors[code].stack = "<generic error, no stack>";
                });
            },
            staticInit: function () {
                FS.ensureErrnoError();
                FS.nameTable = new Array(4096);
                FS.mount(MEMFS, {}, "/");
                FS.createDefaultDirectories();
                FS.createDefaultDevices();
                FS.createSpecialDirectories();
                FS.filesystems = { MEMFS: MEMFS, IDBFS: IDBFS, NODEFS: NODEFS, WORKERFS: WORKERFS };
            },
            init: function (input, output, error) {
                FS.init.initialized = true;
                FS.ensureErrnoError();
                Module["stdin"] = input || Module["stdin"];
                Module["stdout"] = output || Module["stdout"];
                Module["stderr"] = error || Module["stderr"];
                FS.createStandardStreams();
            },
            quit: function () {
                FS.init.initialized = false;
                var fflush = Module["_fflush"];
                if (fflush) fflush(0);
                for (var i = 0; i < FS.streams.length; i++) {
                    var stream = FS.streams[i];
                    if (!stream) {
                        continue;
                    }
                    FS.close(stream);
                }
            },
            getMode: function (canRead, canWrite) {
                var mode = 0;
                if (canRead) mode |= 292 | 73;
                if (canWrite) mode |= 146;
                return mode;
            },
            joinPath: function (parts, forceRelative) {
                var path = PATH.join.apply(null, parts);
                if (forceRelative && path[0] == "/") path = path.substr(1);
                return path;
            },
            absolutePath: function (relative, base) {
                return PATH_FS.resolve(base, relative);
            },
            standardizePath: function (path) {
                return PATH.normalize(path);
            },
            findObject: function (path, dontResolveLastLink) {
                var ret = FS.analyzePath(path, dontResolveLastLink);
                if (ret.exists) {
                    return ret.object;
                } else {
                    ___setErrNo(ret.error);
                    return null;
                }
            },
            analyzePath: function (path, dontResolveLastLink) {
                try {
                    var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
                    path = lookup.path;
                } catch (e) {}
                var ret = {
                    isRoot: false,
                    exists: false,
                    error: 0,
                    name: null,
                    path: null,
                    object: null,
                    parentExists: false,
                    parentPath: null,
                    parentObject: null,
                };
                try {
                    var lookup = FS.lookupPath(path, { parent: true });
                    ret.parentExists = true;
                    ret.parentPath = lookup.path;
                    ret.parentObject = lookup.node;
                    ret.name = PATH.basename(path);
                    lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
                    ret.exists = true;
                    ret.path = lookup.path;
                    ret.object = lookup.node;
                    ret.name = lookup.node.name;
                    ret.isRoot = lookup.path === "/";
                } catch (e) {
                    ret.error = e.errno;
                }
                return ret;
            },
            createFolder: function (parent, name, canRead, canWrite) {
                var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
                var mode = FS.getMode(canRead, canWrite);
                return FS.mkdir(path, mode);
            },
            createPath: function (parent, path, canRead, canWrite) {
                parent = typeof parent === "string" ? parent : FS.getPath(parent);
                var parts = path.split("/").reverse();
                while (parts.length) {
                    var part = parts.pop();
                    if (!part) continue;
                    var current = PATH.join2(parent, part);
                    try {
                        FS.mkdir(current);
                    } catch (e) {}
                    parent = current;
                }
                return current;
            },
            createFile: function (parent, name, properties, canRead, canWrite) {
                var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
                var mode = FS.getMode(canRead, canWrite);
                return FS.create(path, mode);
            },
            createDataFile: function (parent, name, data, canRead, canWrite, canOwn) {
                var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
                var mode = FS.getMode(canRead, canWrite);
                var node = FS.create(path, mode);
                if (data) {
                    if (typeof data === "string") {
                        var arr = new Array(data.length);
                        for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
                        data = arr;
                    }
                    FS.chmod(node, mode | 146);
                    var stream = FS.open(node, "w");
                    FS.write(stream, data, 0, data.length, 0, canOwn);
                    FS.close(stream);
                    FS.chmod(node, mode);
                }
                return node;
            },
            createDevice: function (parent, name, input, output) {
                var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
                var mode = FS.getMode(!!input, !!output);
                if (!FS.createDevice.major) FS.createDevice.major = 64;
                var dev = FS.makedev(FS.createDevice.major++, 0);
                FS.registerDevice(dev, {
                    open: function (stream) {
                        stream.seekable = false;
                    },
                    close: function (stream) {
                        if (output && output.buffer && output.buffer.length) {
                            output(10);
                        }
                    },
                    read: function (stream, buffer, offset, length, pos) {
                        var bytesRead = 0;
                        for (var i = 0; i < length; i++) {
                            var result;
                            try {
                                result = input();
                            } catch (e) {
                                throw new FS.ErrnoError(29);
                            }
                            if (result === undefined && bytesRead === 0) {
                                throw new FS.ErrnoError(6);
                            }
                            if (result === null || result === undefined) break;
                            bytesRead++;
                            buffer[offset + i] = result;
                        }
                        if (bytesRead) {
                            stream.node.timestamp = Date.now();
                        }
                        return bytesRead;
                    },
                    write: function (stream, buffer, offset, length, pos) {
                        for (var i = 0; i < length; i++) {
                            try {
                                output(buffer[offset + i]);
                            } catch (e) {
                                throw new FS.ErrnoError(29);
                            }
                        }
                        if (length) {
                            stream.node.timestamp = Date.now();
                        }
                        return i;
                    },
                });
                return FS.mkdev(path, mode, dev);
            },
            createLink: function (parent, name, target, canRead, canWrite) {
                var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
                return FS.symlink(target, path);
            },
            forceLoadFile: function (obj) {
                if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
                var success = true;
                if (typeof XMLHttpRequest !== "undefined") {
                    throw new Error(
                        "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
                    );
                } else if (read_) {
                    try {
                        obj.contents = intArrayFromString(read_(obj.url), true);
                        obj.usedBytes = obj.contents.length;
                    } catch (e) {
                        success = false;
                    }
                } else {
                    throw new Error("Cannot load without read() or XMLHttpRequest.");
                }
                if (!success) ___setErrNo(29);
                return success;
            },
            createLazyFile: function (parent, name, url, canRead, canWrite) {
                function LazyUint8Array() {
                    this.lengthKnown = false;
                    this.chunks = [];
                }
                LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
                    if (idx > this.length - 1 || idx < 0) {
                        return undefined;
                    }
                    var chunkOffset = idx % this.chunkSize;
                    var chunkNum = (idx / this.chunkSize) | 0;
                    return this.getter(chunkNum)[chunkOffset];
                };
                LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
                    this.getter = getter;
                };
                LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
                    var xhr = new XMLHttpRequest();
                    xhr.open("HEAD", url, false);
                    xhr.send(null);
                    if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
                        throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                    var datalength = Number(xhr.getResponseHeader("Content-length"));
                    var header;
                    var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                    var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
                    var chunkSize = 1024 * 1024;
                    if (!hasByteServing) chunkSize = datalength;
                    var doXHR = function (from, to) {
                        if (from > to)
                            throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                        if (to > datalength - 1)
                            throw new Error("only " + datalength + " bytes available! programmer error!");
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", url, false);
                        if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                        if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
                        if (xhr.overrideMimeType) {
                            xhr.overrideMimeType("text/plain; charset=x-user-defined");
                        }
                        xhr.send(null);
                        if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
                            throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                        if (xhr.response !== undefined) {
                            return new Uint8Array(xhr.response || []);
                        } else {
                            return intArrayFromString(xhr.responseText || "", true);
                        }
                    };
                    var lazyArray = this;
                    lazyArray.setDataGetter(function (chunkNum) {
                        var start = chunkNum * chunkSize;
                        var end = (chunkNum + 1) * chunkSize - 1;
                        end = Math.min(end, datalength - 1);
                        if (typeof lazyArray.chunks[chunkNum] === "undefined") {
                            lazyArray.chunks[chunkNum] = doXHR(start, end);
                        }
                        if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
                        return lazyArray.chunks[chunkNum];
                    });
                    if (usesGzip || !datalength) {
                        chunkSize = datalength = 1;
                        datalength = this.getter(0).length;
                        chunkSize = datalength;
                        console.log("LazyFiles on gzip forces download of the whole file when length is accessed");
                    }
                    this._length = datalength;
                    this._chunkSize = chunkSize;
                    this.lengthKnown = true;
                };
                if (typeof XMLHttpRequest !== "undefined") {
                    if (!ENVIRONMENT_IS_WORKER)
                        throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                    var lazyArray = new LazyUint8Array();
                    Object.defineProperties(lazyArray, {
                        length: {
                            get: function () {
                                if (!this.lengthKnown) {
                                    this.cacheLength();
                                }
                                return this._length;
                            },
                        },
                        chunkSize: {
                            get: function () {
                                if (!this.lengthKnown) {
                                    this.cacheLength();
                                }
                                return this._chunkSize;
                            },
                        },
                    });
                    var properties = { isDevice: false, contents: lazyArray };
                } else {
                    var properties = { isDevice: false, url: url };
                }
                var node = FS.createFile(parent, name, properties, canRead, canWrite);
                if (properties.contents) {
                    node.contents = properties.contents;
                } else if (properties.url) {
                    node.contents = null;
                    node.url = properties.url;
                }
                Object.defineProperties(node, {
                    usedBytes: {
                        get: function () {
                            return this.contents.length;
                        },
                    },
                });
                var stream_ops = {};
                var keys = Object.keys(node.stream_ops);
                keys.forEach(function (key) {
                    var fn = node.stream_ops[key];
                    stream_ops[key] = function forceLoadLazyFile() {
                        if (!FS.forceLoadFile(node)) {
                            throw new FS.ErrnoError(29);
                        }
                        return fn.apply(null, arguments);
                    };
                });
                stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
                    if (!FS.forceLoadFile(node)) {
                        throw new FS.ErrnoError(29);
                    }
                    var contents = stream.node.contents;
                    if (position >= contents.length) return 0;
                    var size = Math.min(contents.length - position, length);
                    if (contents.slice) {
                        for (var i = 0; i < size; i++) {
                            buffer[offset + i] = contents[position + i];
                        }
                    } else {
                        for (var i = 0; i < size; i++) {
                            buffer[offset + i] = contents.get(position + i);
                        }
                    }
                    return size;
                };
                node.stream_ops = stream_ops;
                return node;
            },
            createPreloadedFile: function (
                parent,
                name,
                url,
                canRead,
                canWrite,
                onload,
                onerror,
                dontCreateFile,
                canOwn,
                preFinish
            ) {
                Browser.init();
                var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
                var dep = getUniqueRunDependency("cp " + fullname);
                function processData(byteArray) {
                    function finish(byteArray) {
                        if (preFinish) preFinish();
                        if (!dontCreateFile) {
                            FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
                        }
                        if (onload) onload();
                        removeRunDependency(dep);
                    }
                    var handled = false;
                    Module["preloadPlugins"].forEach(function (plugin) {
                        if (handled) return;
                        if (plugin["canHandle"](fullname)) {
                            plugin["handle"](byteArray, fullname, finish, function () {
                                if (onerror) onerror();
                                removeRunDependency(dep);
                            });
                            handled = true;
                        }
                    });
                    if (!handled) finish(byteArray);
                }
                addRunDependency(dep);
                if (typeof url == "string") {
                    Browser.asyncLoad(
                        url,
                        function (byteArray) {
                            processData(byteArray);
                        },
                        onerror
                    );
                } else {
                    processData(url);
                }
            },
            indexedDB: function () {
                return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            },
            DB_NAME: function () {
                return "EM_FS_" + window.location.pathname;
            },
            DB_VERSION: 20,
            DB_STORE_NAME: "FILE_DATA",
            saveFilesToDB: function (paths, onload, onerror) {
                onload = onload || function () {};
                onerror = onerror || function () {};
                var indexedDB = FS.indexedDB();
                try {
                    var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
                } catch (e) {
                    return onerror(e);
                }
                openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
                    console.log("creating db");
                    var db = openRequest.result;
                    db.createObjectStore(FS.DB_STORE_NAME);
                };
                openRequest.onsuccess = function openRequest_onsuccess() {
                    var db = openRequest.result;
                    var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
                    var files = transaction.objectStore(FS.DB_STORE_NAME);
                    var ok = 0,
                        fail = 0,
                        total = paths.length;
                    function finish() {
                        if (fail == 0) onload();
                        else onerror();
                    }
                    paths.forEach(function (path) {
                        var putRequest = files.put(FS.analyzePath(path).object.contents, path);
                        putRequest.onsuccess = function putRequest_onsuccess() {
                            ok++;
                            if (ok + fail == total) finish();
                        };
                        putRequest.onerror = function putRequest_onerror() {
                            fail++;
                            if (ok + fail == total) finish();
                        };
                    });
                    transaction.onerror = onerror;
                };
                openRequest.onerror = onerror;
            },
            loadFilesFromDB: function (paths, onload, onerror) {
                onload = onload || function () {};
                onerror = onerror || function () {};
                var indexedDB = FS.indexedDB();
                try {
                    var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
                } catch (e) {
                    return onerror(e);
                }
                openRequest.onupgradeneeded = onerror;
                openRequest.onsuccess = function openRequest_onsuccess() {
                    var db = openRequest.result;
                    try {
                        var transaction = db.transaction([FS.DB_STORE_NAME], "readonly");
                    } catch (e) {
                        onerror(e);
                        return;
                    }
                    var files = transaction.objectStore(FS.DB_STORE_NAME);
                    var ok = 0,
                        fail = 0,
                        total = paths.length;
                    function finish() {
                        if (fail == 0) onload();
                        else onerror();
                    }
                    paths.forEach(function (path) {
                        var getRequest = files.get(path);
                        getRequest.onsuccess = function getRequest_onsuccess() {
                            if (FS.analyzePath(path).exists) {
                                FS.unlink(path);
                            }
                            FS.createDataFile(
                                PATH.dirname(path),
                                PATH.basename(path),
                                getRequest.result,
                                true,
                                true,
                                true
                            );
                            ok++;
                            if (ok + fail == total) finish();
                        };
                        getRequest.onerror = function getRequest_onerror() {
                            fail++;
                            if (ok + fail == total) finish();
                        };
                    });
                    transaction.onerror = onerror;
                };
                openRequest.onerror = onerror;
            },
        };
        var SYSCALLS = {
            DEFAULT_POLLMASK: 5,
            mappings: {},
            umask: 511,
            calculateAt: function (dirfd, path) {
                if (path[0] !== "/") {
                    var dir;
                    if (dirfd === -100) {
                        dir = FS.cwd();
                    } else {
                        var dirstream = FS.getStream(dirfd);
                        if (!dirstream) throw new FS.ErrnoError(8);
                        dir = dirstream.path;
                    }
                    path = PATH.join2(dir, path);
                }
                return path;
            },
            doStat: function (func, path, buf) {
                try {
                    var stat = func(path);
                } catch (e) {
                    if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
                        return -54;
                    }
                    throw e;
                }
                HEAP32[buf >> 2] = stat.dev;
                HEAP32[(buf + 4) >> 2] = 0;
                HEAP32[(buf + 8) >> 2] = stat.ino;
                HEAP32[(buf + 12) >> 2] = stat.mode;
                HEAP32[(buf + 16) >> 2] = stat.nlink;
                HEAP32[(buf + 20) >> 2] = stat.uid;
                HEAP32[(buf + 24) >> 2] = stat.gid;
                HEAP32[(buf + 28) >> 2] = stat.rdev;
                HEAP32[(buf + 32) >> 2] = 0;
                (tempI64 = [
                    stat.size >>> 0,
                    ((tempDouble = stat.size),
                    +Math_abs(tempDouble) >= 1
                        ? tempDouble > 0
                            ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0
                            : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
                        : 0),
                ]),
                    (HEAP32[(buf + 40) >> 2] = tempI64[0]),
                    (HEAP32[(buf + 44) >> 2] = tempI64[1]);
                HEAP32[(buf + 48) >> 2] = 4096;
                HEAP32[(buf + 52) >> 2] = stat.blocks;
                HEAP32[(buf + 56) >> 2] = (stat.atime.getTime() / 1e3) | 0;
                HEAP32[(buf + 60) >> 2] = 0;
                HEAP32[(buf + 64) >> 2] = (stat.mtime.getTime() / 1e3) | 0;
                HEAP32[(buf + 68) >> 2] = 0;
                HEAP32[(buf + 72) >> 2] = (stat.ctime.getTime() / 1e3) | 0;
                HEAP32[(buf + 76) >> 2] = 0;
                (tempI64 = [
                    stat.ino >>> 0,
                    ((tempDouble = stat.ino),
                    +Math_abs(tempDouble) >= 1
                        ? tempDouble > 0
                            ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0
                            : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
                        : 0),
                ]),
                    (HEAP32[(buf + 80) >> 2] = tempI64[0]),
                    (HEAP32[(buf + 84) >> 2] = tempI64[1]);
                return 0;
            },
            doMsync: function (addr, stream, len, flags) {
                var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
                FS.msync(stream, buffer, 0, len, flags);
            },
            doMkdir: function (path, mode) {
                path = PATH.normalize(path);
                if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
                FS.mkdir(path, mode, 0);
                return 0;
            },
            doMknod: function (path, mode, dev) {
                switch (mode & 61440) {
                    case 32768:
                    case 8192:
                    case 24576:
                    case 4096:
                    case 49152:
                        break;
                    default:
                        return -28;
                }
                FS.mknod(path, mode, dev);
                return 0;
            },
            doReadlink: function (path, buf, bufsize) {
                if (bufsize <= 0) return -28;
                var ret = FS.readlink(path);
                var len = Math.min(bufsize, lengthBytesUTF8(ret));
                var endChar = HEAP8[buf + len];
                stringToUTF8(ret, buf, bufsize + 1);
                HEAP8[buf + len] = endChar;
                return len;
            },
            doAccess: function (path, amode) {
                if (amode & ~7) {
                    return -28;
                }
                var node;
                var lookup = FS.lookupPath(path, { follow: true });
                node = lookup.node;
                if (!node) {
                    return -44;
                }
                var perms = "";
                if (amode & 4) perms += "r";
                if (amode & 2) perms += "w";
                if (amode & 1) perms += "x";
                if (perms && FS.nodePermissions(node, perms)) {
                    return -2;
                }
                return 0;
            },
            doDup: function (path, flags, suggestFD) {
                var suggest = FS.getStream(suggestFD);
                if (suggest) FS.close(suggest);
                return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
            },
            doReadv: function (stream, iov, iovcnt, offset) {
                var ret = 0;
                for (var i = 0; i < iovcnt; i++) {
                    var ptr = HEAP32[(iov + i * 8) >> 2];
                    var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
                    var curr = FS.read(stream, HEAP8, ptr, len, offset);
                    if (curr < 0) return -1;
                    ret += curr;
                    if (curr < len) break;
                }
                return ret;
            },
            doWritev: function (stream, iov, iovcnt, offset) {
                var ret = 0;
                for (var i = 0; i < iovcnt; i++) {
                    var ptr = HEAP32[(iov + i * 8) >> 2];
                    var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
                    var curr = FS.write(stream, HEAP8, ptr, len, offset);
                    if (curr < 0) return -1;
                    ret += curr;
                }
                return ret;
            },
            varargs: 0,
            get: function (varargs) {
                SYSCALLS.varargs += 4;
                var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
                return ret;
            },
            getStr: function () {
                var ret = UTF8ToString(SYSCALLS.get());
                return ret;
            },
            getStreamFromFD: function (fd) {
                if (!fd) fd = SYSCALLS.get();
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                return stream;
            },
            get64: function () {
                var low = SYSCALLS.get(),
                    high = SYSCALLS.get();
                return low;
            },
            getZero: function () {
                SYSCALLS.get();
            },
        };
        function ___syscall140(which, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                var stream = SYSCALLS.getStreamFromFD(),
                    offset_high = SYSCALLS.get(),
                    offset_low = SYSCALLS.get(),
                    result = SYSCALLS.get(),
                    whence = SYSCALLS.get();
                var HIGH_OFFSET = 4294967296;
                var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
                var DOUBLE_LIMIT = 9007199254740992;
                if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
                    return -61;
                }
                FS.llseek(stream, offset, whence);
                (tempI64 = [
                    stream.position >>> 0,
                    ((tempDouble = stream.position),
                    +Math_abs(tempDouble) >= 1
                        ? tempDouble > 0
                            ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0
                            : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
                        : 0),
                ]),
                    (HEAP32[result >> 2] = tempI64[0]),
                    (HEAP32[(result + 4) >> 2] = tempI64[1]);
                if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
                return 0;
            } catch (e) {
                if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
                return -e.errno;
            }
        }
        function ___syscall145(which, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                var stream = SYSCALLS.getStreamFromFD(),
                    iov = SYSCALLS.get(),
                    iovcnt = SYSCALLS.get();
                return SYSCALLS.doReadv(stream, iov, iovcnt);
            } catch (e) {
                if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
                return -e.errno;
            }
        }
        function __emscripten_syscall_munmap(addr, len) {
            if (addr === -1 || len === 0) {
                return -28;
            }
            var info = SYSCALLS.mappings[addr];
            if (!info) return 0;
            if (len === info.len) {
                var stream = FS.getStream(info.fd);
                SYSCALLS.doMsync(addr, stream, len, info.flags);
                FS.munmap(stream);
                SYSCALLS.mappings[addr] = null;
                if (info.allocated) {
                    _free(info.malloc);
                }
            }
            return 0;
        }
        function ___syscall91(which, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                var addr = SYSCALLS.get(),
                    len = SYSCALLS.get();
                return __emscripten_syscall_munmap(addr, len);
            } catch (e) {
                if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
                return -e.errno;
            }
        }
        function ___unlock() {}
        function _fd_close(fd) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                FS.close(stream);
                return 0;
            } catch (e) {
                if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
                return e.errno;
            }
        }
        function ___wasi_fd_close() {
            return _fd_close.apply(null, arguments);
        }
        function _fd_write(fd, iov, iovcnt, pnum) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var num = SYSCALLS.doWritev(stream, iov, iovcnt);
                HEAP32[pnum >> 2] = num;
                return 0;
            } catch (e) {
                if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
                return e.errno;
            }
        }
        function ___wasi_fd_write() {
            return _fd_write.apply(null, arguments);
        }
        function _abort() {
            abort();
        }
        function _clock() {
            if (_clock.start === undefined) _clock.start = Date.now();
            return ((Date.now() - _clock.start) * (1e6 / 1e3)) | 0;
        }
        function _emscripten_get_now() {
            abort();
        }
        function _emscripten_get_now_is_monotonic() {
            return (
                0 ||
                ENVIRONMENT_IS_NODE ||
                typeof dateNow !== "undefined" ||
                (typeof performance === "object" && performance && typeof performance["now"] === "function")
            );
        }
        function _clock_gettime(clk_id, tp) {
            var now;
            if (clk_id === 0) {
                now = Date.now();
            } else if (clk_id === 1 && _emscripten_get_now_is_monotonic()) {
                now = _emscripten_get_now();
            } else {
                ___setErrNo(28);
                return -1;
            }
            HEAP32[tp >> 2] = (now / 1e3) | 0;
            HEAP32[(tp + 4) >> 2] = ((now % 1e3) * 1e3 * 1e3) | 0;
            return 0;
        }
        function _emscripten_get_heap_size() {
            return HEAP8.length;
        }
        function abortOnCannotGrowMemory(requestedSize) {
            abort("OOM");
        }
        function _emscripten_resize_heap(requestedSize) {
            abortOnCannotGrowMemory(requestedSize);
        }
        function _getenv(name) {
            if (name === 0) return 0;
            name = UTF8ToString(name);
            if (!ENV.hasOwnProperty(name)) return 0;
            if (_getenv.ret) _free(_getenv.ret);
            _getenv.ret = allocateUTF8(ENV[name]);
            return _getenv.ret;
        }
        function _gettimeofday(ptr) {
            var now = Date.now();
            HEAP32[ptr >> 2] = (now / 1e3) | 0;
            HEAP32[(ptr + 4) >> 2] = ((now % 1e3) * 1e3) | 0;
            return 0;
        }
        function _llvm_eh_typeid_for(type) {
            return type;
        }
        function _llvm_stackrestore(p) {
            var self = _llvm_stacksave;
            var ret = self.LLVM_SAVEDSTACKS[p];
            self.LLVM_SAVEDSTACKS.splice(p, 1);
            stackRestore(ret);
        }
        function _llvm_stacksave() {
            var self = _llvm_stacksave;
            if (!self.LLVM_SAVEDSTACKS) {
                self.LLVM_SAVEDSTACKS = [];
            }
            self.LLVM_SAVEDSTACKS.push(stackSave());
            return self.LLVM_SAVEDSTACKS.length - 1;
        }
        function _llvm_trap() {
            abort("trap!");
        }
        var ___tm_current = 511616;
        var ___tm_timezone = (stringToUTF8("GMT", 511664, 4), 511664);
        function _tzset() {
            if (_tzset.called) return;
            _tzset.called = true;
            HEAP32[__get_timezone() >> 2] = new Date().getTimezoneOffset() * 60;
            var currentYear = new Date().getFullYear();
            var winter = new Date(currentYear, 0, 1);
            var summer = new Date(currentYear, 6, 1);
            HEAP32[__get_daylight() >> 2] = Number(winter.getTimezoneOffset() != summer.getTimezoneOffset());
            function extractZone(date) {
                var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
                return match ? match[1] : "GMT";
            }
            var winterName = extractZone(winter);
            var summerName = extractZone(summer);
            var winterNamePtr = allocate(intArrayFromString(winterName), "i8", ALLOC_NORMAL);
            var summerNamePtr = allocate(intArrayFromString(summerName), "i8", ALLOC_NORMAL);
            if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
                HEAP32[__get_tzname() >> 2] = winterNamePtr;
                HEAP32[(__get_tzname() + 4) >> 2] = summerNamePtr;
            } else {
                HEAP32[__get_tzname() >> 2] = summerNamePtr;
                HEAP32[(__get_tzname() + 4) >> 2] = winterNamePtr;
            }
        }
        function _localtime_r(time, tmPtr) {
            _tzset();
            var date = new Date(HEAP32[time >> 2] * 1e3);
            HEAP32[tmPtr >> 2] = date.getSeconds();
            HEAP32[(tmPtr + 4) >> 2] = date.getMinutes();
            HEAP32[(tmPtr + 8) >> 2] = date.getHours();
            HEAP32[(tmPtr + 12) >> 2] = date.getDate();
            HEAP32[(tmPtr + 16) >> 2] = date.getMonth();
            HEAP32[(tmPtr + 20) >> 2] = date.getFullYear() - 1900;
            HEAP32[(tmPtr + 24) >> 2] = date.getDay();
            var start = new Date(date.getFullYear(), 0, 1);
            var yday = ((date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24)) | 0;
            HEAP32[(tmPtr + 28) >> 2] = yday;
            HEAP32[(tmPtr + 36) >> 2] = -(date.getTimezoneOffset() * 60);
            var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
            var winterOffset = start.getTimezoneOffset();
            var dst =
                (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
            HEAP32[(tmPtr + 32) >> 2] = dst;
            var zonePtr = HEAP32[(__get_tzname() + (dst ? 4 : 0)) >> 2];
            HEAP32[(tmPtr + 40) >> 2] = zonePtr;
            return tmPtr;
        }
        function _localtime(time) {
            return _localtime_r(time, ___tm_current);
        }
        function _emscripten_memcpy_big(dest, src, num) {
            HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
        }
        function _pthread_equal(x, y) {
            return x == y;
        }
        function __isLeapYear(year) {
            return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        }
        function __arraySum(array, index) {
            var sum = 0;
            for (var i = 0; i <= index; sum += array[i++]);
            return sum;
        }
        var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        function __addDays(date, days) {
            var newDate = new Date(date.getTime());
            while (days > 0) {
                var leap = __isLeapYear(newDate.getFullYear());
                var currentMonth = newDate.getMonth();
                var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
                if (days > daysInCurrentMonth - newDate.getDate()) {
                    days -= daysInCurrentMonth - newDate.getDate() + 1;
                    newDate.setDate(1);
                    if (currentMonth < 11) {
                        newDate.setMonth(currentMonth + 1);
                    } else {
                        newDate.setMonth(0);
                        newDate.setFullYear(newDate.getFullYear() + 1);
                    }
                } else {
                    newDate.setDate(newDate.getDate() + days);
                    return newDate;
                }
            }
            return newDate;
        }
        function _strftime(s, maxsize, format, tm) {
            var tm_zone = HEAP32[(tm + 40) >> 2];
            var date = {
                tm_sec: HEAP32[tm >> 2],
                tm_min: HEAP32[(tm + 4) >> 2],
                tm_hour: HEAP32[(tm + 8) >> 2],
                tm_mday: HEAP32[(tm + 12) >> 2],
                tm_mon: HEAP32[(tm + 16) >> 2],
                tm_year: HEAP32[(tm + 20) >> 2],
                tm_wday: HEAP32[(tm + 24) >> 2],
                tm_yday: HEAP32[(tm + 28) >> 2],
                tm_isdst: HEAP32[(tm + 32) >> 2],
                tm_gmtoff: HEAP32[(tm + 36) >> 2],
                tm_zone: tm_zone ? UTF8ToString(tm_zone) : "",
            };
            var pattern = UTF8ToString(format);
            var EXPANSION_RULES_1 = {
                "%c": "%a %b %d %H:%M:%S %Y",
                "%D": "%m/%d/%y",
                "%F": "%Y-%m-%d",
                "%h": "%b",
                "%r": "%I:%M:%S %p",
                "%R": "%H:%M",
                "%T": "%H:%M:%S",
                "%x": "%m/%d/%y",
                "%X": "%H:%M:%S",
                "%Ec": "%c",
                "%EC": "%C",
                "%Ex": "%m/%d/%y",
                "%EX": "%H:%M:%S",
                "%Ey": "%y",
                "%EY": "%Y",
                "%Od": "%d",
                "%Oe": "%e",
                "%OH": "%H",
                "%OI": "%I",
                "%Om": "%m",
                "%OM": "%M",
                "%OS": "%S",
                "%Ou": "%u",
                "%OU": "%U",
                "%OV": "%V",
                "%Ow": "%w",
                "%OW": "%W",
                "%Oy": "%y",
            };
            for (var rule in EXPANSION_RULES_1) {
                pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
            }
            var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var MONTHS = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];
            function leadingSomething(value, digits, character) {
                var str = typeof value === "number" ? value.toString() : value || "";
                while (str.length < digits) {
                    str = character[0] + str;
                }
                return str;
            }
            function leadingNulls(value, digits) {
                return leadingSomething(value, digits, "0");
            }
            function compareByDay(date1, date2) {
                function sgn(value) {
                    return value < 0 ? -1 : value > 0 ? 1 : 0;
                }
                var compare;
                if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
                    if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                        compare = sgn(date1.getDate() - date2.getDate());
                    }
                }
                return compare;
            }
            function getFirstWeekStartDate(janFourth) {
                switch (janFourth.getDay()) {
                    case 0:
                        return new Date(janFourth.getFullYear() - 1, 11, 29);
                    case 1:
                        return janFourth;
                    case 2:
                        return new Date(janFourth.getFullYear(), 0, 3);
                    case 3:
                        return new Date(janFourth.getFullYear(), 0, 2);
                    case 4:
                        return new Date(janFourth.getFullYear(), 0, 1);
                    case 5:
                        return new Date(janFourth.getFullYear() - 1, 11, 31);
                    case 6:
                        return new Date(janFourth.getFullYear() - 1, 11, 30);
                }
            }
            function getWeekBasedYear(date) {
                var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
                var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
                var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
                var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
                var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
                if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
                    if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                        return thisDate.getFullYear() + 1;
                    } else {
                        return thisDate.getFullYear();
                    }
                } else {
                    return thisDate.getFullYear() - 1;
                }
            }
            var EXPANSION_RULES_2 = {
                "%a": function (date) {
                    return WEEKDAYS[date.tm_wday].substring(0, 3);
                },
                "%A": function (date) {
                    return WEEKDAYS[date.tm_wday];
                },
                "%b": function (date) {
                    return MONTHS[date.tm_mon].substring(0, 3);
                },
                "%B": function (date) {
                    return MONTHS[date.tm_mon];
                },
                "%C": function (date) {
                    var year = date.tm_year + 1900;
                    return leadingNulls((year / 100) | 0, 2);
                },
                "%d": function (date) {
                    return leadingNulls(date.tm_mday, 2);
                },
                "%e": function (date) {
                    return leadingSomething(date.tm_mday, 2, " ");
                },
                "%g": function (date) {
                    return getWeekBasedYear(date).toString().substring(2);
                },
                "%G": function (date) {
                    return getWeekBasedYear(date);
                },
                "%H": function (date) {
                    return leadingNulls(date.tm_hour, 2);
                },
                "%I": function (date) {
                    var twelveHour = date.tm_hour;
                    if (twelveHour == 0) twelveHour = 12;
                    else if (twelveHour > 12) twelveHour -= 12;
                    return leadingNulls(twelveHour, 2);
                },
                "%j": function (date) {
                    return leadingNulls(
                        date.tm_mday +
                            __arraySum(
                                __isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR,
                                date.tm_mon - 1
                            ),
                        3
                    );
                },
                "%m": function (date) {
                    return leadingNulls(date.tm_mon + 1, 2);
                },
                "%M": function (date) {
                    return leadingNulls(date.tm_min, 2);
                },
                "%n": function () {
                    return "\n";
                },
                "%p": function (date) {
                    if (date.tm_hour >= 0 && date.tm_hour < 12) {
                        return "AM";
                    } else {
                        return "PM";
                    }
                },
                "%S": function (date) {
                    return leadingNulls(date.tm_sec, 2);
                },
                "%t": function () {
                    return "\t";
                },
                "%u": function (date) {
                    return date.tm_wday || 7;
                },
                "%U": function (date) {
                    var janFirst = new Date(date.tm_year + 1900, 0, 1);
                    var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
                    var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
                    if (compareByDay(firstSunday, endDate) < 0) {
                        var februaryFirstUntilEndMonth =
                            __arraySum(
                                __isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR,
                                endDate.getMonth() - 1
                            ) - 31;
                        var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
                        var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
                        return leadingNulls(Math.ceil(days / 7), 2);
                    }
                    return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00";
                },
                "%V": function (date) {
                    var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
                    var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
                    var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
                    var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
                    var endDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
                    if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
                        return "53";
                    }
                    if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
                        return "01";
                    }
                    var daysDifference;
                    if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
                        daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate();
                    } else {
                        daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate();
                    }
                    return leadingNulls(Math.ceil(daysDifference / 7), 2);
                },
                "%w": function (date) {
                    return date.tm_wday;
                },
                "%W": function (date) {
                    var janFirst = new Date(date.tm_year, 0, 1);
                    var firstMonday =
                        janFirst.getDay() === 1
                            ? janFirst
                            : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
                    var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
                    if (compareByDay(firstMonday, endDate) < 0) {
                        var februaryFirstUntilEndMonth =
                            __arraySum(
                                __isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR,
                                endDate.getMonth() - 1
                            ) - 31;
                        var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
                        var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
                        return leadingNulls(Math.ceil(days / 7), 2);
                    }
                    return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00";
                },
                "%y": function (date) {
                    return (date.tm_year + 1900).toString().substring(2);
                },
                "%Y": function (date) {
                    return date.tm_year + 1900;
                },
                "%z": function (date) {
                    var off = date.tm_gmtoff;
                    var ahead = off >= 0;
                    off = Math.abs(off) / 60;
                    off = (off / 60) * 100 + (off % 60);
                    return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
                },
                "%Z": function (date) {
                    return date.tm_zone;
                },
                "%%": function () {
                    return "%";
                },
            };
            for (var rule in EXPANSION_RULES_2) {
                if (pattern.indexOf(rule) >= 0) {
                    pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
                }
            }
            var bytes = intArrayFromString(pattern, false);
            if (bytes.length > maxsize) {
                return 0;
            }
            writeArrayToMemory(bytes, s);
            return bytes.length - 1;
        }
        function _strftime_l(s, maxsize, format, tm) {
            return _strftime(s, maxsize, format, tm);
        }
        function _time(ptr) {
            var ret = (Date.now() / 1e3) | 0;
            if (ptr) {
                HEAP32[ptr >> 2] = ret;
            }
            return ret;
        }
        FS.staticInit();
        if (ENVIRONMENT_HAS_NODE) {
            var fs = require("fs");
            var NODEJS_PATH = require("path");
            NODEFS.staticInit();
        }
        if (ENVIRONMENT_IS_NODE) {
            _emscripten_get_now = function _emscripten_get_now_actual() {
                var t = process["hrtime"]();
                return t[0] * 1e3 + t[1] / 1e6;
            };
        } else if (typeof dateNow !== "undefined") {
            _emscripten_get_now = dateNow;
        } else if (typeof performance === "object" && performance && typeof performance["now"] === "function") {
            _emscripten_get_now = function () {
                return performance["now"]();
            };
        } else {
            _emscripten_get_now = Date.now;
        }
        function intArrayFromString(stringy, dontAddNull, length) {
            var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
            var u8array = new Array(len);
            var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
            if (dontAddNull) u8array.length = numBytesWritten;
            return u8array;
        }
        function invoke_di(index, a1) {
            var sp = stackSave();
            try {
                return dynCall_di(index, a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_dii(index, a1, a2) {
            var sp = stackSave();
            try {
                return dynCall_dii(index, a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_diii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return dynCall_diii(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_fi(index, a1) {
            var sp = stackSave();
            try {
                return dynCall_fi(index, a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_fii(index, a1, a2) {
            var sp = stackSave();
            try {
                return dynCall_fii(index, a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_fiii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return dynCall_fiii(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_fiiii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return dynCall_fiiii(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_i(index) {
            var sp = stackSave();
            try {
                return dynCall_i(index);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_ii(index, a1) {
            var sp = stackSave();
            try {
                return dynCall_ii(index, a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iif(index, a1, a2) {
            var sp = stackSave();
            try {
                return dynCall_iif(index, a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiff(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return dynCall_iiff(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiffi(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return dynCall_iiffi(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iii(index, a1, a2) {
            var sp = stackSave();
            try {
                return dynCall_iii(index, a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiif(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return dynCall_iiif(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiifi(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return dynCall_iiifi(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return dynCall_iiii(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return dynCall_iiiii(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiid(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                return dynCall_iiiiid(index, a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiifii(index, a1, a2, a3, a4, a5, a6, a7) {
            var sp = stackSave();
            try {
                return dynCall_iiiiifii(index, a1, a2, a3, a4, a5, a6, a7);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiifiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
            var sp = stackSave();
            try {
                return dynCall_iiiiifiii(index, a1, a2, a3, a4, a5, a6, a7, a8);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                return dynCall_iiiiii(index, a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                return dynCall_iiiiiii(index, a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
            var sp = stackSave();
            try {
                return dynCall_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
            var sp = stackSave();
            try {
                return dynCall_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            var sp = stackSave();
            try {
                return dynCall_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
            var sp = stackSave();
            try {
                return dynCall_iiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
            var sp = stackSave();
            try {
                return dynCall_iiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
            var sp = stackSave();
            try {
                return dynCall_iiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iij(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return dynCall_iij(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiji(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return dynCall_iiji(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_ji(index, a1) {
            var sp = stackSave();
            try {
                return dynCall_ji(index, a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_jiii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return dynCall_jiii(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_jiiii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return dynCall_jiiii(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_v(index) {
            var sp = stackSave();
            try {
                dynCall_v(index);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vfiii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                dynCall_vfiii(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vi(index, a1) {
            var sp = stackSave();
            try {
                dynCall_vi(index, a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vif(index, a1, a2) {
            var sp = stackSave();
            try {
                dynCall_vif(index, a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viffiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
            var sp = stackSave();
            try {
                dynCall_viffiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vifi(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                dynCall_vifi(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vifii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                dynCall_vifii(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vii(index, a1, a2) {
            var sp = stackSave();
            try {
                dynCall_vii(index, a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viid(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                dynCall_viid(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viif(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                dynCall_viif(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viifff(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                dynCall_viifff(index, a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viifii(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                dynCall_viifii(index, a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                dynCall_viii(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiif(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                dynCall_viiif(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiifi(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                dynCall_viiifi(index, a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiifii(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                dynCall_viiifii(index, a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                dynCall_viiii(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiif(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                dynCall_viiiif(index, a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiii(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                dynCall_viiiii(index, a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiif(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                dynCall_viiiiif(index, a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                dynCall_viiiiii(index, a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
            var sp = stackSave();
            try {
                dynCall_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
            var sp = stackSave();
            try {
                dynCall_viiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            var sp = stackSave();
            try {
                dynCall_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
            var sp = stackSave();
            try {
                dynCall_viiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
            var sp = stackSave();
            try {
                dynCall_viiiiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiij(index, a1, a2, a3, a4, a5, a6, a7) {
            var sp = stackSave();
            try {
                dynCall_viiiiij(index, a1, a2, a3, a4, a5, a6, a7);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiij(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                dynCall_viiiij(index, a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viij(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                dynCall_viij(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viji(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                dynCall_viji(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0 && e !== "longjmp") throw e;
                _setThrew(1, 0);
            }
        }
        var asmGlobalArg = {};
        var asmLibraryArg = {
            w: ___assert_fail,
            Ma: ___buildEnvironment,
            d: ___cxa_allocate_exception,
            p: ___cxa_begin_catch,
            r: ___cxa_end_catch,
            b: ___cxa_find_matching_catch_2,
            h: ___cxa_find_matching_catch_3,
            Q: ___cxa_find_matching_catch_4,
            e: ___cxa_free_exception,
            F: ___cxa_get_exception_ptr,
            oa: ___cxa_rethrow,
            i: ___cxa_throw,
            La: ___cxa_uncaught_exceptions,
            fa: ___lock,
            Ka: ___map_file,
            f: ___resumeException,
            Ja: ___syscall140,
            Ia: ___syscall145,
            Ha: ___syscall91,
            V: ___unlock,
            Ga: ___wasi_fd_close,
            Fa: ___wasi_fd_write,
            __memory_base: 1024,
            __table_base: 0,
            ma: _abort,
            U: _clock,
            Ea: _clock_gettime,
            Da: _emscripten_get_heap_size,
            Ca: _emscripten_memcpy_big,
            Ba: _emscripten_resize_heap,
            Z: _getenv,
            Aa: _gettimeofday,
            q: _llvm_eh_typeid_for,
            J: _llvm_stackrestore,
            I: _llvm_stacksave,
            la: _llvm_trap,
            Y: _localtime,
            za: _pthread_equal,
            ya: _strftime_l,
            P: _time,
            v: abort,
            a: getTempRet0,
            sa: invoke_di,
            L: invoke_dii,
            $: invoke_diii,
            y: invoke_fi,
            B: invoke_fii,
            na: invoke_fiii,
            N: invoke_fiiii,
            x: invoke_i,
            l: invoke_ii,
            ka: invoke_iif,
            Ta: invoke_iiff,
            Sa: invoke_iiffi,
            j: invoke_iii,
            ja: invoke_iiif,
            ea: invoke_iiifi,
            m: invoke_iiii,
            s: invoke_iiiii,
            Ra: invoke_iiiiid,
            ia: invoke_iiiiifii,
            X: invoke_iiiiifiii,
            u: invoke_iiiiii,
            A: invoke_iiiiiii,
            M: invoke_iiiiiiii,
            da: invoke_iiiiiiiii,
            ha: invoke_iiiiiiiiii,
            D: invoke_iiiiiiiiiii,
            ca: invoke_iiiiiiiiiiii,
            T: invoke_iiiiiiiiiiiii,
            xa: invoke_iij,
            wa: invoke_iiji,
            va: invoke_ji,
            ua: invoke_jiii,
            ta: invoke_jiiii,
            o: invoke_v,
            ra: invoke_vfiii,
            k: invoke_vi,
            ba: invoke_vif,
            Qa: invoke_viffiiiii,
            aa: invoke_vifi,
            Pa: invoke_vifii,
            g: invoke_vii,
            G: invoke_viid,
            K: invoke_viif,
            H: invoke_viifff,
            Oa: invoke_viifii,
            c: invoke_viii,
            E: invoke_viiif,
            qa: invoke_viiifi,
            ga: invoke_viiifii,
            n: invoke_viiii,
            W: invoke_viiiif,
            t: invoke_viiiii,
            pa: invoke_viiiiif,
            z: invoke_viiiiii,
            C: invoke_viiiiiii,
            Na: invoke_viiiiiiii,
            S: invoke_viiiiiiiii,
            R: invoke_viiiiiiiiii,
            _: invoke_viiiiiiiiiiiiiii,
            Xa: invoke_viiiiij,
            Wa: invoke_viiiij,
            Va: invoke_viij,
            Ua: invoke_viji,
            memory: wasmMemory,
            O: setTempRet0,
            table: wasmTable,
        };
        var asm = Module["asm"](asmGlobalArg, asmLibraryArg, buffer);
        Module["asm"] = asm;
        var __ZSt18uncaught_exceptionv = (Module["__ZSt18uncaught_exceptionv"] = function () {
            return Module["asm"]["Ya"].apply(null, arguments);
        });
        var ___cxa_can_catch = (Module["___cxa_can_catch"] = function () {
            return Module["asm"]["Za"].apply(null, arguments);
        });
        var ___cxa_is_pointer_type = (Module["___cxa_is_pointer_type"] = function () {
            return Module["asm"]["_a"].apply(null, arguments);
        });
        var ___errno_location = (Module["___errno_location"] = function () {
            return Module["asm"]["$a"].apply(null, arguments);
        });
        var __get_daylight = (Module["__get_daylight"] = function () {
            return Module["asm"]["ab"].apply(null, arguments);
        });
        var __get_timezone = (Module["__get_timezone"] = function () {
            return Module["asm"]["bb"].apply(null, arguments);
        });
        var __get_tzname = (Module["__get_tzname"] = function () {
            return Module["asm"]["cb"].apply(null, arguments);
        });
        var _free = (Module["_free"] = function () {
            return Module["asm"]["db"].apply(null, arguments);
        });
        var _indigoAddAtom = (Module["_indigoAddAtom"] = function () {
            return Module["asm"]["eb"].apply(null, arguments);
        });
        var _indigoAddBond = (Module["_indigoAddBond"] = function () {
            return Module["asm"]["fb"].apply(null, arguments);
        });
        var _indigoAddCatalyst = (Module["_indigoAddCatalyst"] = function () {
            return Module["asm"]["gb"].apply(null, arguments);
        });
        var _indigoAddConstraint = (Module["_indigoAddConstraint"] = function () {
            return Module["asm"]["hb"].apply(null, arguments);
        });
        var _indigoAddConstraintNot = (Module["_indigoAddConstraintNot"] = function () {
            return Module["asm"]["ib"].apply(null, arguments);
        });
        var _indigoAddConstraintOr = (Module["_indigoAddConstraintOr"] = function () {
            return Module["asm"]["jb"].apply(null, arguments);
        });
        var _indigoAddDataSGroup = (Module["_indigoAddDataSGroup"] = function () {
            return Module["asm"]["kb"].apply(null, arguments);
        });
        var _indigoAddDecomposition = (Module["_indigoAddDecomposition"] = function () {
            return Module["asm"]["lb"].apply(null, arguments);
        });
        var _indigoAddProduct = (Module["_indigoAddProduct"] = function () {
            return Module["asm"]["mb"].apply(null, arguments);
        });
        var _indigoAddRSite = (Module["_indigoAddRSite"] = function () {
            return Module["asm"]["nb"].apply(null, arguments);
        });
        var _indigoAddReactant = (Module["_indigoAddReactant"] = function () {
            return Module["asm"]["ob"].apply(null, arguments);
        });
        var _indigoAddSGroupAttachmentPoint = (Module["_indigoAddSGroupAttachmentPoint"] = function () {
            return Module["asm"]["pb"].apply(null, arguments);
        });
        var _indigoAddStereocenter = (Module["_indigoAddStereocenter"] = function () {
            return Module["asm"]["qb"].apply(null, arguments);
        });
        var _indigoAddSuperatom = (Module["_indigoAddSuperatom"] = function () {
            return Module["asm"]["rb"].apply(null, arguments);
        });
        var _indigoAlignAtoms = (Module["_indigoAlignAtoms"] = function () {
            return Module["asm"]["sb"].apply(null, arguments);
        });
        var _indigoAllScaffolds = (Module["_indigoAllScaffolds"] = function () {
            return Module["asm"]["tb"].apply(null, arguments);
        });
        var _indigoAllocSessionId = (Module["_indigoAllocSessionId"] = function () {
            return Module["asm"]["ub"].apply(null, arguments);
        });
        var _indigoAppend = (Module["_indigoAppend"] = function () {
            return Module["asm"]["vb"].apply(null, arguments);
        });
        var _indigoAromatize = (Module["_indigoAromatize"] = function () {
            return Module["asm"]["wb"].apply(null, arguments);
        });
        var _indigoArrayAdd = (Module["_indigoArrayAdd"] = function () {
            return Module["asm"]["xb"].apply(null, arguments);
        });
        var _indigoAt = (Module["_indigoAt"] = function () {
            return Module["asm"]["yb"].apply(null, arguments);
        });
        var _indigoAtomicNumber = (Module["_indigoAtomicNumber"] = function () {
            return Module["asm"]["zb"].apply(null, arguments);
        });
        var _indigoAutomap = (Module["_indigoAutomap"] = function () {
            return Module["asm"]["Ab"].apply(null, arguments);
        });
        var _indigoBond = (Module["_indigoBond"] = function () {
            return Module["asm"]["Bb"].apply(null, arguments);
        });
        var _indigoBondOrder = (Module["_indigoBondOrder"] = function () {
            return Module["asm"]["Cb"].apply(null, arguments);
        });
        var _indigoBondStereo = (Module["_indigoBondStereo"] = function () {
            return Module["asm"]["Db"].apply(null, arguments);
        });
        var _indigoCanonicalSmarts = (Module["_indigoCanonicalSmarts"] = function () {
            return Module["asm"]["Eb"].apply(null, arguments);
        });
        var _indigoCanonicalSmiles = (Module["_indigoCanonicalSmiles"] = function () {
            return Module["asm"]["Fb"].apply(null, arguments);
        });
        var _indigoCdxml = (Module["_indigoCdxml"] = function () {
            return Module["asm"]["Gb"].apply(null, arguments);
        });
        var _indigoChangeStereocenterType = (Module["_indigoChangeStereocenterType"] = function () {
            return Module["asm"]["Hb"].apply(null, arguments);
        });
        var _indigoCheckAmbiguousH = (Module["_indigoCheckAmbiguousH"] = function () {
            return Module["asm"]["Ib"].apply(null, arguments);
        });
        var _indigoCheckBadValence = (Module["_indigoCheckBadValence"] = function () {
            return Module["asm"]["Jb"].apply(null, arguments);
        });
        var _indigoCheckQuery = (Module["_indigoCheckQuery"] = function () {
            return Module["asm"]["Kb"].apply(null, arguments);
        });
        var _indigoCheckRGroups = (Module["_indigoCheckRGroups"] = function () {
            return Module["asm"]["Lb"].apply(null, arguments);
        });
        var _indigoCheckValence = (Module["_indigoCheckValence"] = function () {
            return Module["asm"]["Mb"].apply(null, arguments);
        });
        var _indigoClean2d = (Module["_indigoClean2d"] = function () {
            return Module["asm"]["Nb"].apply(null, arguments);
        });
        var _indigoClear = (Module["_indigoClear"] = function () {
            return Module["asm"]["Ob"].apply(null, arguments);
        });
        var _indigoClearAAM = (Module["_indigoClearAAM"] = function () {
            return Module["asm"]["Pb"].apply(null, arguments);
        });
        var _indigoClearAlleneCenters = (Module["_indigoClearAlleneCenters"] = function () {
            return Module["asm"]["Qb"].apply(null, arguments);
        });
        var _indigoClearAttachmentPoints = (Module["_indigoClearAttachmentPoints"] = function () {
            return Module["asm"]["Rb"].apply(null, arguments);
        });
        var _indigoClearCisTrans = (Module["_indigoClearCisTrans"] = function () {
            return Module["asm"]["Sb"].apply(null, arguments);
        });
        var _indigoClearProperties = (Module["_indigoClearProperties"] = function () {
            return Module["asm"]["Tb"].apply(null, arguments);
        });
        var _indigoClearStereocenters = (Module["_indigoClearStereocenters"] = function () {
            return Module["asm"]["Ub"].apply(null, arguments);
        });
        var _indigoClearTautomerRules = (Module["_indigoClearTautomerRules"] = function () {
            return Module["asm"]["Vb"].apply(null, arguments);
        });
        var _indigoClone = (Module["_indigoClone"] = function () {
            return Module["asm"]["Wb"].apply(null, arguments);
        });
        var _indigoClose = (Module["_indigoClose"] = function () {
            return Module["asm"]["Xb"].apply(null, arguments);
        });
        var _indigoCml = (Module["_indigoCml"] = function () {
            return Module["asm"]["Yb"].apply(null, arguments);
        });
        var _indigoCmlAppend = (Module["_indigoCmlAppend"] = function () {
            return Module["asm"]["Zb"].apply(null, arguments);
        });
        var _indigoCmlFooter = (Module["_indigoCmlFooter"] = function () {
            return Module["asm"]["_b"].apply(null, arguments);
        });
        var _indigoCmlHeader = (Module["_indigoCmlHeader"] = function () {
            return Module["asm"]["$b"].apply(null, arguments);
        });
        var _indigoCommonBits = (Module["_indigoCommonBits"] = function () {
            return Module["asm"]["ac"].apply(null, arguments);
        });
        var _indigoComponent = (Module["_indigoComponent"] = function () {
            return Module["asm"]["bc"].apply(null, arguments);
        });
        var _indigoComponentIndex = (Module["_indigoComponentIndex"] = function () {
            return Module["asm"]["cc"].apply(null, arguments);
        });
        var _indigoCorrectReactingCenters = (Module["_indigoCorrectReactingCenters"] = function () {
            return Module["asm"]["dc"].apply(null, arguments);
        });
        var _indigoCount = (Module["_indigoCount"] = function () {
            return Module["asm"]["ec"].apply(null, arguments);
        });
        var _indigoCountAlleneCenters = (Module["_indigoCountAlleneCenters"] = function () {
            return Module["asm"]["fc"].apply(null, arguments);
        });
        var _indigoCountAtoms = (Module["_indigoCountAtoms"] = function () {
            return Module["asm"]["gc"].apply(null, arguments);
        });
        var _indigoCountAttachmentPoints = (Module["_indigoCountAttachmentPoints"] = function () {
            return Module["asm"]["hc"].apply(null, arguments);
        });
        var _indigoCountBits = (Module["_indigoCountBits"] = function () {
            return Module["asm"]["ic"].apply(null, arguments);
        });
        var _indigoCountBonds = (Module["_indigoCountBonds"] = function () {
            return Module["asm"]["jc"].apply(null, arguments);
        });
        var _indigoCountCatalysts = (Module["_indigoCountCatalysts"] = function () {
            return Module["asm"]["kc"].apply(null, arguments);
        });
        var _indigoCountComponents = (Module["_indigoCountComponents"] = function () {
            return Module["asm"]["lc"].apply(null, arguments);
        });
        var _indigoCountDataSGroups = (Module["_indigoCountDataSGroups"] = function () {
            return Module["asm"]["mc"].apply(null, arguments);
        });
        var _indigoCountGenericSGroups = (Module["_indigoCountGenericSGroups"] = function () {
            return Module["asm"]["nc"].apply(null, arguments);
        });
        var _indigoCountHeavyAtoms = (Module["_indigoCountHeavyAtoms"] = function () {
            return Module["asm"]["oc"].apply(null, arguments);
        });
        var _indigoCountHydrogens = (Module["_indigoCountHydrogens"] = function () {
            return Module["asm"]["pc"].apply(null, arguments);
        });
        var _indigoCountImplicitHydrogens = (Module["_indigoCountImplicitHydrogens"] = function () {
            return Module["asm"]["qc"].apply(null, arguments);
        });
        var _indigoCountMatches = (Module["_indigoCountMatches"] = function () {
            return Module["asm"]["rc"].apply(null, arguments);
        });
        var _indigoCountMatchesWithLimit = (Module["_indigoCountMatchesWithLimit"] = function () {
            return Module["asm"]["sc"].apply(null, arguments);
        });
        var _indigoCountMolecules = (Module["_indigoCountMolecules"] = function () {
            return Module["asm"]["tc"].apply(null, arguments);
        });
        var _indigoCountMultipleGroups = (Module["_indigoCountMultipleGroups"] = function () {
            return Module["asm"]["uc"].apply(null, arguments);
        });
        var _indigoCountProducts = (Module["_indigoCountProducts"] = function () {
            return Module["asm"]["vc"].apply(null, arguments);
        });
        var _indigoCountPseudoatoms = (Module["_indigoCountPseudoatoms"] = function () {
            return Module["asm"]["wc"].apply(null, arguments);
        });
        var _indigoCountRGroups = (Module["_indigoCountRGroups"] = function () {
            return Module["asm"]["xc"].apply(null, arguments);
        });
        var _indigoCountRSites = (Module["_indigoCountRSites"] = function () {
            return Module["asm"]["yc"].apply(null, arguments);
        });
        var _indigoCountReactants = (Module["_indigoCountReactants"] = function () {
            return Module["asm"]["zc"].apply(null, arguments);
        });
        var _indigoCountReferences = (Module["_indigoCountReferences"] = function () {
            return Module["asm"]["Ac"].apply(null, arguments);
        });
        var _indigoCountRepeatingUnits = (Module["_indigoCountRepeatingUnits"] = function () {
            return Module["asm"]["Bc"].apply(null, arguments);
        });
        var _indigoCountSSSR = (Module["_indigoCountSSSR"] = function () {
            return Module["asm"]["Cc"].apply(null, arguments);
        });
        var _indigoCountStereocenters = (Module["_indigoCountStereocenters"] = function () {
            return Module["asm"]["Dc"].apply(null, arguments);
        });
        var _indigoCountSuperatoms = (Module["_indigoCountSuperatoms"] = function () {
            return Module["asm"]["Ec"].apply(null, arguments);
        });
        var _indigoCreateArray = (Module["_indigoCreateArray"] = function () {
            return Module["asm"]["Fc"].apply(null, arguments);
        });
        var _indigoCreateDecomposer = (Module["_indigoCreateDecomposer"] = function () {
            return Module["asm"]["Gc"].apply(null, arguments);
        });
        var _indigoCreateEdgeSubmolecule = (Module["_indigoCreateEdgeSubmolecule"] = function () {
            return Module["asm"]["Hc"].apply(null, arguments);
        });
        var _indigoCreateMolecule = (Module["_indigoCreateMolecule"] = function () {
            return Module["asm"]["Ic"].apply(null, arguments);
        });
        var _indigoCreateQueryMolecule = (Module["_indigoCreateQueryMolecule"] = function () {
            return Module["asm"]["Jc"].apply(null, arguments);
        });
        var _indigoCreateQueryReaction = (Module["_indigoCreateQueryReaction"] = function () {
            return Module["asm"]["Kc"].apply(null, arguments);
        });
        var _indigoCreateReaction = (Module["_indigoCreateReaction"] = function () {
            return Module["asm"]["Lc"].apply(null, arguments);
        });
        var _indigoCreateSGroup = (Module["_indigoCreateSGroup"] = function () {
            return Module["asm"]["Mc"].apply(null, arguments);
        });
        var _indigoCreateSaver = (Module["_indigoCreateSaver"] = function () {
            return Module["asm"]["Nc"].apply(null, arguments);
        });
        var _indigoCreateSubmolecule = (Module["_indigoCreateSubmolecule"] = function () {
            return Module["asm"]["Oc"].apply(null, arguments);
        });
        var _indigoData = (Module["_indigoData"] = function () {
            return Module["asm"]["Pc"].apply(null, arguments);
        });
        var _indigoDbgBreakpoint = (Module["_indigoDbgBreakpoint"] = function () {
            return Module["asm"]["Qc"].apply(null, arguments);
        });
        var _indigoDbgInternalType = (Module["_indigoDbgInternalType"] = function () {
            return Module["asm"]["Rc"].apply(null, arguments);
        });
        var _indigoDbgProfiling = (Module["_indigoDbgProfiling"] = function () {
            return Module["asm"]["Sc"].apply(null, arguments);
        });
        var _indigoDbgProfilingGetCounter = (Module["_indigoDbgProfilingGetCounter"] = function () {
            return Module["asm"]["Tc"].apply(null, arguments);
        });
        var _indigoDbgResetProfiling = (Module["_indigoDbgResetProfiling"] = function () {
            return Module["asm"]["Uc"].apply(null, arguments);
        });
        var _indigoDearomatize = (Module["_indigoDearomatize"] = function () {
            return Module["asm"]["Vc"].apply(null, arguments);
        });
        var _indigoDecomposeMolecule = (Module["_indigoDecomposeMolecule"] = function () {
            return Module["asm"]["Wc"].apply(null, arguments);
        });
        var _indigoDecomposeMolecules = (Module["_indigoDecomposeMolecules"] = function () {
            return Module["asm"]["Xc"].apply(null, arguments);
        });
        var _indigoDecomposedMoleculeHighlighted = (Module["_indigoDecomposedMoleculeHighlighted"] = function () {
            return Module["asm"]["Yc"].apply(null, arguments);
        });
        var _indigoDecomposedMoleculeScaffold = (Module["_indigoDecomposedMoleculeScaffold"] = function () {
            return Module["asm"]["Zc"].apply(null, arguments);
        });
        var _indigoDecomposedMoleculeWithRGroups = (Module["_indigoDecomposedMoleculeWithRGroups"] = function () {
            return Module["asm"]["_c"].apply(null, arguments);
        });
        var _indigoDegree = (Module["_indigoDegree"] = function () {
            return Module["asm"]["$c"].apply(null, arguments);
        });
        var _indigoDeleteSGroupAttachmentPoint = (Module["_indigoDeleteSGroupAttachmentPoint"] = function () {
            return Module["asm"]["ad"].apply(null, arguments);
        });
        var _indigoDescription = (Module["_indigoDescription"] = function () {
            return Module["asm"]["bd"].apply(null, arguments);
        });
        var _indigoDestination = (Module["_indigoDestination"] = function () {
            return Module["asm"]["cd"].apply(null, arguments);
        });
        var _indigoExactMatch = (Module["_indigoExactMatch"] = function () {
            return Module["asm"]["dd"].apply(null, arguments);
        });
        var _indigoExpandAbbreviations = (Module["_indigoExpandAbbreviations"] = function () {
            return Module["asm"]["ed"].apply(null, arguments);
        });
        var _indigoExtractCommonScaffold = (Module["_indigoExtractCommonScaffold"] = function () {
            return Module["asm"]["fd"].apply(null, arguments);
        });
        var _indigoFindSGroups = (Module["_indigoFindSGroups"] = function () {
            return Module["asm"]["gd"].apply(null, arguments);
        });
        var _indigoFingerprint = (Module["_indigoFingerprint"] = function () {
            return Module["asm"]["hd"].apply(null, arguments);
        });
        var _indigoFoldHydrogens = (Module["_indigoFoldHydrogens"] = function () {
            return Module["asm"]["id"].apply(null, arguments);
        });
        var _indigoFree = (Module["_indigoFree"] = function () {
            return Module["asm"]["jd"].apply(null, arguments);
        });
        var _indigoFreeAllObjects = (Module["_indigoFreeAllObjects"] = function () {
            return Module["asm"]["kd"].apply(null, arguments);
        });
        var _indigoGetAcidPkaValue = (Module["_indigoGetAcidPkaValue"] = function () {
            return Module["asm"]["ld"].apply(null, arguments);
        });
        var _indigoGetAtom = (Module["_indigoGetAtom"] = function () {
            return Module["asm"]["md"].apply(null, arguments);
        });
        var _indigoGetAtomMappingNumber = (Module["_indigoGetAtomMappingNumber"] = function () {
            return Module["asm"]["nd"].apply(null, arguments);
        });
        var _indigoGetBasicPkaValue = (Module["_indigoGetBasicPkaValue"] = function () {
            return Module["asm"]["od"].apply(null, arguments);
        });
        var _indigoGetBond = (Module["_indigoGetBond"] = function () {
            return Module["asm"]["pd"].apply(null, arguments);
        });
        var _indigoGetCharge = (Module["_indigoGetCharge"] = function () {
            return Module["asm"]["qd"].apply(null, arguments);
        });
        var _indigoGetDataSGroup = (Module["_indigoGetDataSGroup"] = function () {
            return Module["asm"]["rd"].apply(null, arguments);
        });
        var _indigoGetExplicitValence = (Module["_indigoGetExplicitValence"] = function () {
            return Module["asm"]["sd"].apply(null, arguments);
        });
        var _indigoGetFragmentedMolecule = (Module["_indigoGetFragmentedMolecule"] = function () {
            return Module["asm"]["td"].apply(null, arguments);
        });
        var _indigoGetGenericSGroup = (Module["_indigoGetGenericSGroup"] = function () {
            return Module["asm"]["ud"].apply(null, arguments);
        });
        var _indigoGetLastError = (Module["_indigoGetLastError"] = function () {
            return Module["asm"]["vd"].apply(null, arguments);
        });
        var _indigoGetMolecule = (Module["_indigoGetMolecule"] = function () {
            return Module["asm"]["wd"].apply(null, arguments);
        });
        var _indigoGetMultipleGroup = (Module["_indigoGetMultipleGroup"] = function () {
            return Module["asm"]["xd"].apply(null, arguments);
        });
        var _indigoGetProperty = (Module["_indigoGetProperty"] = function () {
            return Module["asm"]["yd"].apply(null, arguments);
        });
        var _indigoGetRadical = (Module["_indigoGetRadical"] = function () {
            return Module["asm"]["zd"].apply(null, arguments);
        });
        var _indigoGetRadicalElectrons = (Module["_indigoGetRadicalElectrons"] = function () {
            return Module["asm"]["Ad"].apply(null, arguments);
        });
        var _indigoGetReactingCenter = (Module["_indigoGetReactingCenter"] = function () {
            return Module["asm"]["Bd"].apply(null, arguments);
        });
        var _indigoGetRepeatingUnit = (Module["_indigoGetRepeatingUnit"] = function () {
            return Module["asm"]["Cd"].apply(null, arguments);
        });
        var _indigoGetRepeatingUnitConnectivity = (Module["_indigoGetRepeatingUnitConnectivity"] = function () {
            return Module["asm"]["Dd"].apply(null, arguments);
        });
        var _indigoGetRepeatingUnitSubscript = (Module["_indigoGetRepeatingUnitSubscript"] = function () {
            return Module["asm"]["Ed"].apply(null, arguments);
        });
        var _indigoGetSGroupClass = (Module["_indigoGetSGroupClass"] = function () {
            return Module["asm"]["Fd"].apply(null, arguments);
        });
        var _indigoGetSGroupDisplayOption = (Module["_indigoGetSGroupDisplayOption"] = function () {
            return Module["asm"]["Gd"].apply(null, arguments);
        });
        var _indigoGetSGroupIndex = (Module["_indigoGetSGroupIndex"] = function () {
            return Module["asm"]["Hd"].apply(null, arguments);
        });
        var _indigoGetSGroupMultiplier = (Module["_indigoGetSGroupMultiplier"] = function () {
            return Module["asm"]["Id"].apply(null, arguments);
        });
        var _indigoGetSGroupName = (Module["_indigoGetSGroupName"] = function () {
            return Module["asm"]["Jd"].apply(null, arguments);
        });
        var _indigoGetSGroupNumCrossBonds = (Module["_indigoGetSGroupNumCrossBonds"] = function () {
            return Module["asm"]["Kd"].apply(null, arguments);
        });
        var _indigoGetSGroupOriginalId = (Module["_indigoGetSGroupOriginalId"] = function () {
            return Module["asm"]["Ld"].apply(null, arguments);
        });
        var _indigoGetSGroupParentId = (Module["_indigoGetSGroupParentId"] = function () {
            return Module["asm"]["Md"].apply(null, arguments);
        });
        var _indigoGetSGroupSeqId = (Module["_indigoGetSGroupSeqId"] = function () {
            return Module["asm"]["Nd"].apply(null, arguments);
        });
        var _indigoGetSGroupType = (Module["_indigoGetSGroupType"] = function () {
            return Module["asm"]["Od"].apply(null, arguments);
        });
        var _indigoGetSubmolecule = (Module["_indigoGetSubmolecule"] = function () {
            return Module["asm"]["Pd"].apply(null, arguments);
        });
        var _indigoGetSuperatom = (Module["_indigoGetSuperatom"] = function () {
            return Module["asm"]["Qd"].apply(null, arguments);
        });
        var _indigoGrossFormula = (Module["_indigoGrossFormula"] = function () {
            return Module["asm"]["Rd"].apply(null, arguments);
        });
        var _indigoHasCoord = (Module["_indigoHasCoord"] = function () {
            return Module["asm"]["Sd"].apply(null, arguments);
        });
        var _indigoHasNext = (Module["_indigoHasNext"] = function () {
            return Module["asm"]["Td"].apply(null, arguments);
        });
        var _indigoHasProperty = (Module["_indigoHasProperty"] = function () {
            return Module["asm"]["Ud"].apply(null, arguments);
        });
        var _indigoHasZCoord = (Module["_indigoHasZCoord"] = function () {
            return Module["asm"]["Vd"].apply(null, arguments);
        });
        var _indigoHighlight = (Module["_indigoHighlight"] = function () {
            return Module["asm"]["Wd"].apply(null, arguments);
        });
        var _indigoHighlightedTarget = (Module["_indigoHighlightedTarget"] = function () {
            return Module["asm"]["Xd"].apply(null, arguments);
        });
        var _indigoIgnoreAtom = (Module["_indigoIgnoreAtom"] = function () {
            return Module["asm"]["Yd"].apply(null, arguments);
        });
        var _indigoIndex = (Module["_indigoIndex"] = function () {
            return Module["asm"]["Zd"].apply(null, arguments);
        });
        var _indigoInvertStereo = (Module["_indigoInvertStereo"] = function () {
            return Module["asm"]["_d"].apply(null, arguments);
        });
        var _indigoIonize = (Module["_indigoIonize"] = function () {
            return Module["asm"]["$d"].apply(null, arguments);
        });
        var _indigoIsChiral = (Module["_indigoIsChiral"] = function () {
            return Module["asm"]["ae"].apply(null, arguments);
        });
        var _indigoIsHighlighted = (Module["_indigoIsHighlighted"] = function () {
            return Module["asm"]["be"].apply(null, arguments);
        });
        var _indigoIsPossibleFischerProjection = (Module["_indigoIsPossibleFischerProjection"] = function () {
            return Module["asm"]["ce"].apply(null, arguments);
        });
        var _indigoIsPseudoatom = (Module["_indigoIsPseudoatom"] = function () {
            return Module["asm"]["de"].apply(null, arguments);
        });
        var _indigoIsRSite = (Module["_indigoIsRSite"] = function () {
            return Module["asm"]["ee"].apply(null, arguments);
        });
        var _indigoIsotope = (Module["_indigoIsotope"] = function () {
            return Module["asm"]["fe"].apply(null, arguments);
        });
        var _indigoIterateAlleneCenters = (Module["_indigoIterateAlleneCenters"] = function () {
            return Module["asm"]["ge"].apply(null, arguments);
        });
        var _indigoIterateArray = (Module["_indigoIterateArray"] = function () {
            return Module["asm"]["he"].apply(null, arguments);
        });
        var _indigoIterateAtoms = (Module["_indigoIterateAtoms"] = function () {
            return Module["asm"]["ie"].apply(null, arguments);
        });
        var _indigoIterateAttachmentPoints = (Module["_indigoIterateAttachmentPoints"] = function () {
            return Module["asm"]["je"].apply(null, arguments);
        });
        var _indigoIterateBonds = (Module["_indigoIterateBonds"] = function () {
            return Module["asm"]["ke"].apply(null, arguments);
        });
        var _indigoIterateCDX = (Module["_indigoIterateCDX"] = function () {
            return Module["asm"]["le"].apply(null, arguments);
        });
        var _indigoIterateCML = (Module["_indigoIterateCML"] = function () {
            return Module["asm"]["me"].apply(null, arguments);
        });
        var _indigoIterateCatalysts = (Module["_indigoIterateCatalysts"] = function () {
            return Module["asm"]["ne"].apply(null, arguments);
        });
        var _indigoIterateComponents = (Module["_indigoIterateComponents"] = function () {
            return Module["asm"]["oe"].apply(null, arguments);
        });
        var _indigoIterateDataSGroups = (Module["_indigoIterateDataSGroups"] = function () {
            return Module["asm"]["pe"].apply(null, arguments);
        });
        var _indigoIterateDecomposedMolecules = (Module["_indigoIterateDecomposedMolecules"] = function () {
            return Module["asm"]["qe"].apply(null, arguments);
        });
        var _indigoIterateDecompositions = (Module["_indigoIterateDecompositions"] = function () {
            return Module["asm"]["re"].apply(null, arguments);
        });
        var _indigoIterateEdgeSubmolecules = (Module["_indigoIterateEdgeSubmolecules"] = function () {
            return Module["asm"]["se"].apply(null, arguments);
        });
        var _indigoIterateGenericSGroups = (Module["_indigoIterateGenericSGroups"] = function () {
            return Module["asm"]["te"].apply(null, arguments);
        });
        var _indigoIterateMatches = (Module["_indigoIterateMatches"] = function () {
            return Module["asm"]["ue"].apply(null, arguments);
        });
        var _indigoIterateMolecules = (Module["_indigoIterateMolecules"] = function () {
            return Module["asm"]["ve"].apply(null, arguments);
        });
        var _indigoIterateMultipleGroups = (Module["_indigoIterateMultipleGroups"] = function () {
            return Module["asm"]["we"].apply(null, arguments);
        });
        var _indigoIterateNeighbors = (Module["_indigoIterateNeighbors"] = function () {
            return Module["asm"]["xe"].apply(null, arguments);
        });
        var _indigoIterateProducts = (Module["_indigoIterateProducts"] = function () {
            return Module["asm"]["ye"].apply(null, arguments);
        });
        var _indigoIterateProperties = (Module["_indigoIterateProperties"] = function () {
            return Module["asm"]["ze"].apply(null, arguments);
        });
        var _indigoIteratePseudoatoms = (Module["_indigoIteratePseudoatoms"] = function () {
            return Module["asm"]["Ae"].apply(null, arguments);
        });
        var _indigoIterateRDF = (Module["_indigoIterateRDF"] = function () {
            return Module["asm"]["Be"].apply(null, arguments);
        });
        var _indigoIterateRGroupFragments = (Module["_indigoIterateRGroupFragments"] = function () {
            return Module["asm"]["Ce"].apply(null, arguments);
        });
        var _indigoIterateRGroups = (Module["_indigoIterateRGroups"] = function () {
            return Module["asm"]["De"].apply(null, arguments);
        });
        var _indigoIterateRSites = (Module["_indigoIterateRSites"] = function () {
            return Module["asm"]["Ee"].apply(null, arguments);
        });
        var _indigoIterateReactants = (Module["_indigoIterateReactants"] = function () {
            return Module["asm"]["Fe"].apply(null, arguments);
        });
        var _indigoIterateRepeatingUnits = (Module["_indigoIterateRepeatingUnits"] = function () {
            return Module["asm"]["Ge"].apply(null, arguments);
        });
        var _indigoIterateRings = (Module["_indigoIterateRings"] = function () {
            return Module["asm"]["He"].apply(null, arguments);
        });
        var _indigoIterateSDF = (Module["_indigoIterateSDF"] = function () {
            return Module["asm"]["Ie"].apply(null, arguments);
        });
        var _indigoIterateSGroups = (Module["_indigoIterateSGroups"] = function () {
            return Module["asm"]["Je"].apply(null, arguments);
        });
        var _indigoIterateSSSR = (Module["_indigoIterateSSSR"] = function () {
            return Module["asm"]["Ke"].apply(null, arguments);
        });
        var _indigoIterateSmiles = (Module["_indigoIterateSmiles"] = function () {
            return Module["asm"]["Le"].apply(null, arguments);
        });
        var _indigoIterateStereocenters = (Module["_indigoIterateStereocenters"] = function () {
            return Module["asm"]["Me"].apply(null, arguments);
        });
        var _indigoIterateSubtrees = (Module["_indigoIterateSubtrees"] = function () {
            return Module["asm"]["Ne"].apply(null, arguments);
        });
        var _indigoIterateSuperatoms = (Module["_indigoIterateSuperatoms"] = function () {
            return Module["asm"]["Oe"].apply(null, arguments);
        });
        var _indigoIterateTautomers = (Module["_indigoIterateTautomers"] = function () {
            return Module["asm"]["Pe"].apply(null, arguments);
        });
        var _indigoLayeredCode = (Module["_indigoLayeredCode"] = function () {
            return Module["asm"]["Qe"].apply(null, arguments);
        });
        var _indigoLayout = (Module["_indigoLayout"] = function () {
            return Module["asm"]["Re"].apply(null, arguments);
        });
        var _indigoLoadBuffer = (Module["_indigoLoadBuffer"] = function () {
            return Module["asm"]["Se"].apply(null, arguments);
        });
        var _indigoLoadMolecule = (Module["_indigoLoadMolecule"] = function () {
            return Module["asm"]["Te"].apply(null, arguments);
        });
        var _indigoLoadMoleculeFromBuffer = (Module["_indigoLoadMoleculeFromBuffer"] = function () {
            return Module["asm"]["Ue"].apply(null, arguments);
        });
        var _indigoLoadMoleculeFromString = (Module["_indigoLoadMoleculeFromString"] = function () {
            return Module["asm"]["Ve"].apply(null, arguments);
        });
        var _indigoLoadQueryMolecule = (Module["_indigoLoadQueryMolecule"] = function () {
            return Module["asm"]["We"].apply(null, arguments);
        });
        var _indigoLoadQueryMoleculeFromBuffer = (Module["_indigoLoadQueryMoleculeFromBuffer"] = function () {
            return Module["asm"]["Xe"].apply(null, arguments);
        });
        var _indigoLoadQueryMoleculeFromString = (Module["_indigoLoadQueryMoleculeFromString"] = function () {
            return Module["asm"]["Ye"].apply(null, arguments);
        });
        var _indigoLoadQueryReaction = (Module["_indigoLoadQueryReaction"] = function () {
            return Module["asm"]["Ze"].apply(null, arguments);
        });
        var _indigoLoadQueryReactionFromBuffer = (Module["_indigoLoadQueryReactionFromBuffer"] = function () {
            return Module["asm"]["_e"].apply(null, arguments);
        });
        var _indigoLoadQueryReactionFromString = (Module["_indigoLoadQueryReactionFromString"] = function () {
            return Module["asm"]["$e"].apply(null, arguments);
        });
        var _indigoLoadReaction = (Module["_indigoLoadReaction"] = function () {
            return Module["asm"]["af"].apply(null, arguments);
        });
        var _indigoLoadReactionFromBuffer = (Module["_indigoLoadReactionFromBuffer"] = function () {
            return Module["asm"]["bf"].apply(null, arguments);
        });
        var _indigoLoadReactionFromString = (Module["_indigoLoadReactionFromString"] = function () {
            return Module["asm"]["cf"].apply(null, arguments);
        });
        var _indigoLoadReactionSmarts = (Module["_indigoLoadReactionSmarts"] = function () {
            return Module["asm"]["df"].apply(null, arguments);
        });
        var _indigoLoadReactionSmartsFromBuffer = (Module["_indigoLoadReactionSmartsFromBuffer"] = function () {
            return Module["asm"]["ef"].apply(null, arguments);
        });
        var _indigoLoadReactionSmartsFromString = (Module["_indigoLoadReactionSmartsFromString"] = function () {
            return Module["asm"]["ff"].apply(null, arguments);
        });
        var _indigoLoadSmarts = (Module["_indigoLoadSmarts"] = function () {
            return Module["asm"]["gf"].apply(null, arguments);
        });
        var _indigoLoadSmartsFromBuffer = (Module["_indigoLoadSmartsFromBuffer"] = function () {
            return Module["asm"]["hf"].apply(null, arguments);
        });
        var _indigoLoadSmartsFromString = (Module["_indigoLoadSmartsFromString"] = function () {
            return Module["asm"]["jf"].apply(null, arguments);
        });
        var _indigoLoadString = (Module["_indigoLoadString"] = function () {
            return Module["asm"]["kf"].apply(null, arguments);
        });
        var _indigoMapAtom = (Module["_indigoMapAtom"] = function () {
            return Module["asm"]["lf"].apply(null, arguments);
        });
        var _indigoMapBond = (Module["_indigoMapBond"] = function () {
            return Module["asm"]["mf"].apply(null, arguments);
        });
        var _indigoMapMolecule = (Module["_indigoMapMolecule"] = function () {
            return Module["asm"]["nf"].apply(null, arguments);
        });
        var _indigoMarkEitherCisTrans = (Module["_indigoMarkEitherCisTrans"] = function () {
            return Module["asm"]["of"].apply(null, arguments);
        });
        var _indigoMarkStereobonds = (Module["_indigoMarkStereobonds"] = function () {
            return Module["asm"]["pf"].apply(null, arguments);
        });
        var _indigoMassComposition = (Module["_indigoMassComposition"] = function () {
            return Module["asm"]["qf"].apply(null, arguments);
        });
        var _indigoMatch = (Module["_indigoMatch"] = function () {
            return Module["asm"]["rf"].apply(null, arguments);
        });
        var _indigoMerge = (Module["_indigoMerge"] = function () {
            return Module["asm"]["sf"].apply(null, arguments);
        });
        var _indigoMolecularWeight = (Module["_indigoMolecularWeight"] = function () {
            return Module["asm"]["tf"].apply(null, arguments);
        });
        var _indigoMolfile = (Module["_indigoMolfile"] = function () {
            return Module["asm"]["uf"].apply(null, arguments);
        });
        var _indigoMonoisotopicMass = (Module["_indigoMonoisotopicMass"] = function () {
            return Module["asm"]["vf"].apply(null, arguments);
        });
        var _indigoMostAbundantMass = (Module["_indigoMostAbundantMass"] = function () {
            return Module["asm"]["wf"].apply(null, arguments);
        });
        var _indigoName = (Module["_indigoName"] = function () {
            return Module["asm"]["xf"].apply(null, arguments);
        });
        var _indigoNameToStructure = (Module["_indigoNameToStructure"] = function () {
            return Module["asm"]["yf"].apply(null, arguments);
        });
        var _indigoNext = (Module["_indigoNext"] = function () {
            return Module["asm"]["zf"].apply(null, arguments);
        });
        var _indigoNormalize = (Module["_indigoNormalize"] = function () {
            return Module["asm"]["Af"].apply(null, arguments);
        });
        var _indigoOneBitsList = (Module["_indigoOneBitsList"] = function () {
            return Module["asm"]["Bf"].apply(null, arguments);
        });
        var _indigoOptimize = (Module["_indigoOptimize"] = function () {
            return Module["asm"]["Cf"].apply(null, arguments);
        });
        var _indigoRGroupComposition = (Module["_indigoRGroupComposition"] = function () {
            return Module["asm"]["Df"].apply(null, arguments);
        });
        var _indigoRawData = (Module["_indigoRawData"] = function () {
            return Module["asm"]["Ef"].apply(null, arguments);
        });
        var _indigoRdfAppend = (Module["_indigoRdfAppend"] = function () {
            return Module["asm"]["Ff"].apply(null, arguments);
        });
        var _indigoRdfHeader = (Module["_indigoRdfHeader"] = function () {
            return Module["asm"]["Gf"].apply(null, arguments);
        });
        var _indigoReactionProductEnumerate = (Module["_indigoReactionProductEnumerate"] = function () {
            return Module["asm"]["Hf"].apply(null, arguments);
        });
        var _indigoReadBuffer = (Module["_indigoReadBuffer"] = function () {
            return Module["asm"]["If"].apply(null, arguments);
        });
        var _indigoReadString = (Module["_indigoReadString"] = function () {
            return Module["asm"]["Jf"].apply(null, arguments);
        });
        var _indigoReleaseSessionId = (Module["_indigoReleaseSessionId"] = function () {
            return Module["asm"]["Kf"].apply(null, arguments);
        });
        var _indigoRemove = (Module["_indigoRemove"] = function () {
            return Module["asm"]["Lf"].apply(null, arguments);
        });
        var _indigoRemoveAtoms = (Module["_indigoRemoveAtoms"] = function () {
            return Module["asm"]["Mf"].apply(null, arguments);
        });
        var _indigoRemoveBonds = (Module["_indigoRemoveBonds"] = function () {
            return Module["asm"]["Nf"].apply(null, arguments);
        });
        var _indigoRemoveConstraints = (Module["_indigoRemoveConstraints"] = function () {
            return Module["asm"]["Of"].apply(null, arguments);
        });
        var _indigoRemoveProperty = (Module["_indigoRemoveProperty"] = function () {
            return Module["asm"]["Pf"].apply(null, arguments);
        });
        var _indigoRemoveTautomerRule = (Module["_indigoRemoveTautomerRule"] = function () {
            return Module["asm"]["Qf"].apply(null, arguments);
        });
        var _indigoResetAtom = (Module["_indigoResetAtom"] = function () {
            return Module["asm"]["Rf"].apply(null, arguments);
        });
        var _indigoResetCharge = (Module["_indigoResetCharge"] = function () {
            return Module["asm"]["Sf"].apply(null, arguments);
        });
        var _indigoResetExplicitValence = (Module["_indigoResetExplicitValence"] = function () {
            return Module["asm"]["Tf"].apply(null, arguments);
        });
        var _indigoResetIsotope = (Module["_indigoResetIsotope"] = function () {
            return Module["asm"]["Uf"].apply(null, arguments);
        });
        var _indigoResetOptions = (Module["_indigoResetOptions"] = function () {
            return Module["asm"]["Vf"].apply(null, arguments);
        });
        var _indigoResetRadical = (Module["_indigoResetRadical"] = function () {
            return Module["asm"]["Wf"].apply(null, arguments);
        });
        var _indigoResetStereo = (Module["_indigoResetStereo"] = function () {
            return Module["asm"]["Xf"].apply(null, arguments);
        });
        var _indigoResetSymmetricCisTrans = (Module["_indigoResetSymmetricCisTrans"] = function () {
            return Module["asm"]["Yf"].apply(null, arguments);
        });
        var _indigoResetSymmetricStereocenters = (Module["_indigoResetSymmetricStereocenters"] = function () {
            return Module["asm"]["Zf"].apply(null, arguments);
        });
        var _indigoRxnfile = (Module["_indigoRxnfile"] = function () {
            return Module["asm"]["_f"].apply(null, arguments);
        });
        var _indigoSaveCdxml = (Module["_indigoSaveCdxml"] = function () {
            return Module["asm"]["$f"].apply(null, arguments);
        });
        var _indigoSaveCml = (Module["_indigoSaveCml"] = function () {
            return Module["asm"]["ag"].apply(null, arguments);
        });
        var _indigoSaveMDLCT = (Module["_indigoSaveMDLCT"] = function () {
            return Module["asm"]["bg"].apply(null, arguments);
        });
        var _indigoSaveMolfile = (Module["_indigoSaveMolfile"] = function () {
            return Module["asm"]["cg"].apply(null, arguments);
        });
        var _indigoSaveRxnfile = (Module["_indigoSaveRxnfile"] = function () {
            return Module["asm"]["dg"].apply(null, arguments);
        });
        var _indigoSdfAppend = (Module["_indigoSdfAppend"] = function () {
            return Module["asm"]["eg"].apply(null, arguments);
        });
        var _indigoSetAtomMappingNumber = (Module["_indigoSetAtomMappingNumber"] = function () {
            return Module["asm"]["fg"].apply(null, arguments);
        });
        var _indigoSetAttachmentPoint = (Module["_indigoSetAttachmentPoint"] = function () {
            return Module["asm"]["gg"].apply(null, arguments);
        });
        var _indigoSetBondOrder = (Module["_indigoSetBondOrder"] = function () {
            return Module["asm"]["hg"].apply(null, arguments);
        });
        var _indigoSetCharge = (Module["_indigoSetCharge"] = function () {
            return Module["asm"]["ig"].apply(null, arguments);
        });
        var _indigoSetDataSGroupXY = (Module["_indigoSetDataSGroupXY"] = function () {
            return Module["asm"]["jg"].apply(null, arguments);
        });
        var _indigoSetExplicitValence = (Module["_indigoSetExplicitValence"] = function () {
            return Module["asm"]["kg"].apply(null, arguments);
        });
        var _indigoSetImplicitHCount = (Module["_indigoSetImplicitHCount"] = function () {
            return Module["asm"]["lg"].apply(null, arguments);
        });
        var _indigoSetIsotope = (Module["_indigoSetIsotope"] = function () {
            return Module["asm"]["mg"].apply(null, arguments);
        });
        var _indigoSetName = (Module["_indigoSetName"] = function () {
            return Module["asm"]["ng"].apply(null, arguments);
        });
        var _indigoSetOption = (Module["_indigoSetOption"] = function () {
            return Module["asm"]["og"].apply(null, arguments);
        });
        var _indigoSetOptionBool = (Module["_indigoSetOptionBool"] = function () {
            return Module["asm"]["pg"].apply(null, arguments);
        });
        var _indigoSetOptionColor = (Module["_indigoSetOptionColor"] = function () {
            return Module["asm"]["qg"].apply(null, arguments);
        });
        var _indigoSetOptionFloat = (Module["_indigoSetOptionFloat"] = function () {
            return Module["asm"]["rg"].apply(null, arguments);
        });
        var _indigoSetOptionInt = (Module["_indigoSetOptionInt"] = function () {
            return Module["asm"]["sg"].apply(null, arguments);
        });
        var _indigoSetOptionXY = (Module["_indigoSetOptionXY"] = function () {
            return Module["asm"]["tg"].apply(null, arguments);
        });
        var _indigoSetProperty = (Module["_indigoSetProperty"] = function () {
            return Module["asm"]["ug"].apply(null, arguments);
        });
        var _indigoSetRSite = (Module["_indigoSetRSite"] = function () {
            return Module["asm"]["vg"].apply(null, arguments);
        });
        var _indigoSetRadical = (Module["_indigoSetRadical"] = function () {
            return Module["asm"]["wg"].apply(null, arguments);
        });
        var _indigoSetReactingCenter = (Module["_indigoSetReactingCenter"] = function () {
            return Module["asm"]["xg"].apply(null, arguments);
        });
        var _indigoSetSGroupBrackets = (Module["_indigoSetSGroupBrackets"] = function () {
            return Module["asm"]["yg"].apply(null, arguments);
        });
        var _indigoSetSGroupClass = (Module["_indigoSetSGroupClass"] = function () {
            return Module["asm"]["zg"].apply(null, arguments);
        });
        var _indigoSetSGroupCoords = (Module["_indigoSetSGroupCoords"] = function () {
            return Module["asm"]["Ag"].apply(null, arguments);
        });
        var _indigoSetSGroupData = (Module["_indigoSetSGroupData"] = function () {
            return Module["asm"]["Bg"].apply(null, arguments);
        });
        var _indigoSetSGroupDataType = (Module["_indigoSetSGroupDataType"] = function () {
            return Module["asm"]["Cg"].apply(null, arguments);
        });
        var _indigoSetSGroupDescription = (Module["_indigoSetSGroupDescription"] = function () {
            return Module["asm"]["Dg"].apply(null, arguments);
        });
        var _indigoSetSGroupDisplay = (Module["_indigoSetSGroupDisplay"] = function () {
            return Module["asm"]["Eg"].apply(null, arguments);
        });
        var _indigoSetSGroupDisplayOption = (Module["_indigoSetSGroupDisplayOption"] = function () {
            return Module["asm"]["Fg"].apply(null, arguments);
        });
        var _indigoSetSGroupFieldName = (Module["_indigoSetSGroupFieldName"] = function () {
            return Module["asm"]["Gg"].apply(null, arguments);
        });
        var _indigoSetSGroupLocation = (Module["_indigoSetSGroupLocation"] = function () {
            return Module["asm"]["Hg"].apply(null, arguments);
        });
        var _indigoSetSGroupMultiplier = (Module["_indigoSetSGroupMultiplier"] = function () {
            return Module["asm"]["Ig"].apply(null, arguments);
        });
        var _indigoSetSGroupName = (Module["_indigoSetSGroupName"] = function () {
            return Module["asm"]["Jg"].apply(null, arguments);
        });
        var _indigoSetSGroupOriginalId = (Module["_indigoSetSGroupOriginalId"] = function () {
            return Module["asm"]["Kg"].apply(null, arguments);
        });
        var _indigoSetSGroupParentId = (Module["_indigoSetSGroupParentId"] = function () {
            return Module["asm"]["Lg"].apply(null, arguments);
        });
        var _indigoSetSGroupQueryCode = (Module["_indigoSetSGroupQueryCode"] = function () {
            return Module["asm"]["Mg"].apply(null, arguments);
        });
        var _indigoSetSGroupQueryOper = (Module["_indigoSetSGroupQueryOper"] = function () {
            return Module["asm"]["Ng"].apply(null, arguments);
        });
        var _indigoSetSGroupTag = (Module["_indigoSetSGroupTag"] = function () {
            return Module["asm"]["Og"].apply(null, arguments);
        });
        var _indigoSetSGroupTagAlign = (Module["_indigoSetSGroupTagAlign"] = function () {
            return Module["asm"]["Pg"].apply(null, arguments);
        });
        var _indigoSetSGroupXCoord = (Module["_indigoSetSGroupXCoord"] = function () {
            return Module["asm"]["Qg"].apply(null, arguments);
        });
        var _indigoSetSGroupYCoord = (Module["_indigoSetSGroupYCoord"] = function () {
            return Module["asm"]["Rg"].apply(null, arguments);
        });
        var _indigoSetSessionId = (Module["_indigoSetSessionId"] = function () {
            return Module["asm"]["Sg"].apply(null, arguments);
        });
        var _indigoSetStereocenterGroup = (Module["_indigoSetStereocenterGroup"] = function () {
            return Module["asm"]["Tg"].apply(null, arguments);
        });
        var _indigoSetTautomerRule = (Module["_indigoSetTautomerRule"] = function () {
            return Module["asm"]["Ug"].apply(null, arguments);
        });
        var _indigoSetXYZ = (Module["_indigoSetXYZ"] = function () {
            return Module["asm"]["Vg"].apply(null, arguments);
        });
        var _indigoSimilarity = (Module["_indigoSimilarity"] = function () {
            return Module["asm"]["Wg"].apply(null, arguments);
        });
        var _indigoSingleAllowedRGroup = (Module["_indigoSingleAllowedRGroup"] = function () {
            return Module["asm"]["Xg"].apply(null, arguments);
        });
        var _indigoSmarts = (Module["_indigoSmarts"] = function () {
            return Module["asm"]["Yg"].apply(null, arguments);
        });
        var _indigoSmiles = (Module["_indigoSmiles"] = function () {
            return Module["asm"]["Zg"].apply(null, arguments);
        });
        var _indigoSmilesAppend = (Module["_indigoSmilesAppend"] = function () {
            return Module["asm"]["_g"].apply(null, arguments);
        });
        var _indigoSource = (Module["_indigoSource"] = function () {
            return Module["asm"]["$g"].apply(null, arguments);
        });
        var _indigoStandardize = (Module["_indigoStandardize"] = function () {
            return Module["asm"]["ah"].apply(null, arguments);
        });
        var _indigoStereocenterGroup = (Module["_indigoStereocenterGroup"] = function () {
            return Module["asm"]["bh"].apply(null, arguments);
        });
        var _indigoStereocenterPyramid = (Module["_indigoStereocenterPyramid"] = function () {
            return Module["asm"]["ch"].apply(null, arguments);
        });
        var _indigoStereocenterType = (Module["_indigoStereocenterType"] = function () {
            return Module["asm"]["dh"].apply(null, arguments);
        });
        var _indigoSubstructureMatcher = (Module["_indigoSubstructureMatcher"] = function () {
            return Module["asm"]["eh"].apply(null, arguments);
        });
        var _indigoSymbol = (Module["_indigoSymbol"] = function () {
            return Module["asm"]["fh"].apply(null, arguments);
        });
        var _indigoSymmetryClasses = (Module["_indigoSymmetryClasses"] = function () {
            return Module["asm"]["gh"].apply(null, arguments);
        });
        var _indigoTell = (Module["_indigoTell"] = function () {
            return Module["asm"]["hh"].apply(null, arguments);
        });
        var _indigoTell64 = (Module["_indigoTell64"] = function () {
            return Module["asm"]["ih"].apply(null, arguments);
        });
        var _indigoToString = (Module["_indigoToString"] = function () {
            return Module["asm"]["jh"].apply(null, arguments);
        });
        var _indigoTopology = (Module["_indigoTopology"] = function () {
            return Module["asm"]["kh"].apply(null, arguments);
        });
        var _indigoTransform = (Module["_indigoTransform"] = function () {
            return Module["asm"]["lh"].apply(null, arguments);
        });
        var _indigoTransformCTABtoSCSR = (Module["_indigoTransformCTABtoSCSR"] = function () {
            return Module["asm"]["mh"].apply(null, arguments);
        });
        var _indigoTransformHELMtoSCSR = (Module["_indigoTransformHELMtoSCSR"] = function () {
            return Module["asm"]["nh"].apply(null, arguments);
        });
        var _indigoTransformSCSRtoCTAB = (Module["_indigoTransformSCSRtoCTAB"] = function () {
            return Module["asm"]["oh"].apply(null, arguments);
        });
        var _indigoUnfoldHydrogens = (Module["_indigoUnfoldHydrogens"] = function () {
            return Module["asm"]["ph"].apply(null, arguments);
        });
        var _indigoUnhighlight = (Module["_indigoUnhighlight"] = function () {
            return Module["asm"]["qh"].apply(null, arguments);
        });
        var _indigoUnignoreAllAtoms = (Module["_indigoUnignoreAllAtoms"] = function () {
            return Module["asm"]["rh"].apply(null, arguments);
        });
        var _indigoUnignoreAtom = (Module["_indigoUnignoreAtom"] = function () {
            return Module["asm"]["sh"].apply(null, arguments);
        });
        var _indigoUnserialize = (Module["_indigoUnserialize"] = function () {
            return Module["asm"]["th"].apply(null, arguments);
        });
        var _indigoValence = (Module["_indigoValence"] = function () {
            return Module["asm"]["uh"].apply(null, arguments);
        });
        var _indigoValidateChirality = (Module["_indigoValidateChirality"] = function () {
            return Module["asm"]["vh"].apply(null, arguments);
        });
        var _indigoVersion = (Module["_indigoVersion"] = function () {
            return Module["asm"]["wh"].apply(null, arguments);
        });
        var _indigoWriteBuffer = (Module["_indigoWriteBuffer"] = function () {
            return Module["asm"]["xh"].apply(null, arguments);
        });
        var _indigoXYZ = (Module["_indigoXYZ"] = function () {
            return Module["asm"]["yh"].apply(null, arguments);
        });
        var _malloc = (Module["_malloc"] = function () {
            return Module["asm"]["zh"].apply(null, arguments);
        });
        var _setThrew = (Module["_setThrew"] = function () {
            return Module["asm"]["Ah"].apply(null, arguments);
        });
        var globalCtors = (Module["globalCtors"] = function () {
            return Module["asm"]["Ki"].apply(null, arguments);
        });
        var stackAlloc = (Module["stackAlloc"] = function () {
            return Module["asm"]["Li"].apply(null, arguments);
        });
        var stackRestore = (Module["stackRestore"] = function () {
            return Module["asm"]["Mi"].apply(null, arguments);
        });
        var stackSave = (Module["stackSave"] = function () {
            return Module["asm"]["Ni"].apply(null, arguments);
        });
        var dynCall_di = (Module["dynCall_di"] = function () {
            return Module["asm"]["Bh"].apply(null, arguments);
        });
        var dynCall_dii = (Module["dynCall_dii"] = function () {
            return Module["asm"]["Ch"].apply(null, arguments);
        });
        var dynCall_diii = (Module["dynCall_diii"] = function () {
            return Module["asm"]["Dh"].apply(null, arguments);
        });
        var dynCall_fi = (Module["dynCall_fi"] = function () {
            return Module["asm"]["Eh"].apply(null, arguments);
        });
        var dynCall_fii = (Module["dynCall_fii"] = function () {
            return Module["asm"]["Fh"].apply(null, arguments);
        });
        var dynCall_fiii = (Module["dynCall_fiii"] = function () {
            return Module["asm"]["Gh"].apply(null, arguments);
        });
        var dynCall_fiiii = (Module["dynCall_fiiii"] = function () {
            return Module["asm"]["Hh"].apply(null, arguments);
        });
        var dynCall_i = (Module["dynCall_i"] = function () {
            return Module["asm"]["Ih"].apply(null, arguments);
        });
        var dynCall_ii = (Module["dynCall_ii"] = function () {
            return Module["asm"]["Jh"].apply(null, arguments);
        });
        var dynCall_iif = (Module["dynCall_iif"] = function () {
            return Module["asm"]["Kh"].apply(null, arguments);
        });
        var dynCall_iiff = (Module["dynCall_iiff"] = function () {
            return Module["asm"]["Lh"].apply(null, arguments);
        });
        var dynCall_iiffi = (Module["dynCall_iiffi"] = function () {
            return Module["asm"]["Mh"].apply(null, arguments);
        });
        var dynCall_iii = (Module["dynCall_iii"] = function () {
            return Module["asm"]["Nh"].apply(null, arguments);
        });
        var dynCall_iiif = (Module["dynCall_iiif"] = function () {
            return Module["asm"]["Oh"].apply(null, arguments);
        });
        var dynCall_iiifi = (Module["dynCall_iiifi"] = function () {
            return Module["asm"]["Ph"].apply(null, arguments);
        });
        var dynCall_iiii = (Module["dynCall_iiii"] = function () {
            return Module["asm"]["Qh"].apply(null, arguments);
        });
        var dynCall_iiiii = (Module["dynCall_iiiii"] = function () {
            return Module["asm"]["Rh"].apply(null, arguments);
        });
        var dynCall_iiiiid = (Module["dynCall_iiiiid"] = function () {
            return Module["asm"]["Sh"].apply(null, arguments);
        });
        var dynCall_iiiiifii = (Module["dynCall_iiiiifii"] = function () {
            return Module["asm"]["Th"].apply(null, arguments);
        });
        var dynCall_iiiiifiii = (Module["dynCall_iiiiifiii"] = function () {
            return Module["asm"]["Uh"].apply(null, arguments);
        });
        var dynCall_iiiiii = (Module["dynCall_iiiiii"] = function () {
            return Module["asm"]["Vh"].apply(null, arguments);
        });
        var dynCall_iiiiiii = (Module["dynCall_iiiiiii"] = function () {
            return Module["asm"]["Wh"].apply(null, arguments);
        });
        var dynCall_iiiiiiii = (Module["dynCall_iiiiiiii"] = function () {
            return Module["asm"]["Xh"].apply(null, arguments);
        });
        var dynCall_iiiiiiiii = (Module["dynCall_iiiiiiiii"] = function () {
            return Module["asm"]["Yh"].apply(null, arguments);
        });
        var dynCall_iiiiiiiiii = (Module["dynCall_iiiiiiiiii"] = function () {
            return Module["asm"]["Zh"].apply(null, arguments);
        });
        var dynCall_iiiiiiiiiii = (Module["dynCall_iiiiiiiiiii"] = function () {
            return Module["asm"]["_h"].apply(null, arguments);
        });
        var dynCall_iiiiiiiiiiii = (Module["dynCall_iiiiiiiiiiii"] = function () {
            return Module["asm"]["$h"].apply(null, arguments);
        });
        var dynCall_iiiiiiiiiiiii = (Module["dynCall_iiiiiiiiiiiii"] = function () {
            return Module["asm"]["ai"].apply(null, arguments);
        });
        var dynCall_iij = (Module["dynCall_iij"] = function () {
            return Module["asm"]["bi"].apply(null, arguments);
        });
        var dynCall_iiji = (Module["dynCall_iiji"] = function () {
            return Module["asm"]["ci"].apply(null, arguments);
        });
        var dynCall_ji = (Module["dynCall_ji"] = function () {
            return Module["asm"]["di"].apply(null, arguments);
        });
        var dynCall_jiii = (Module["dynCall_jiii"] = function () {
            return Module["asm"]["ei"].apply(null, arguments);
        });
        var dynCall_jiiii = (Module["dynCall_jiiii"] = function () {
            return Module["asm"]["fi"].apply(null, arguments);
        });
        var dynCall_v = (Module["dynCall_v"] = function () {
            return Module["asm"]["gi"].apply(null, arguments);
        });
        var dynCall_vfiii = (Module["dynCall_vfiii"] = function () {
            return Module["asm"]["hi"].apply(null, arguments);
        });
        var dynCall_vi = (Module["dynCall_vi"] = function () {
            return Module["asm"]["ii"].apply(null, arguments);
        });
        var dynCall_vif = (Module["dynCall_vif"] = function () {
            return Module["asm"]["ji"].apply(null, arguments);
        });
        var dynCall_viffiiiii = (Module["dynCall_viffiiiii"] = function () {
            return Module["asm"]["ki"].apply(null, arguments);
        });
        var dynCall_vifi = (Module["dynCall_vifi"] = function () {
            return Module["asm"]["li"].apply(null, arguments);
        });
        var dynCall_vifii = (Module["dynCall_vifii"] = function () {
            return Module["asm"]["mi"].apply(null, arguments);
        });
        var dynCall_vii = (Module["dynCall_vii"] = function () {
            return Module["asm"]["ni"].apply(null, arguments);
        });
        var dynCall_viid = (Module["dynCall_viid"] = function () {
            return Module["asm"]["oi"].apply(null, arguments);
        });
        var dynCall_viif = (Module["dynCall_viif"] = function () {
            return Module["asm"]["pi"].apply(null, arguments);
        });
        var dynCall_viifff = (Module["dynCall_viifff"] = function () {
            return Module["asm"]["qi"].apply(null, arguments);
        });
        var dynCall_viifii = (Module["dynCall_viifii"] = function () {
            return Module["asm"]["ri"].apply(null, arguments);
        });
        var dynCall_viii = (Module["dynCall_viii"] = function () {
            return Module["asm"]["si"].apply(null, arguments);
        });
        var dynCall_viiif = (Module["dynCall_viiif"] = function () {
            return Module["asm"]["ti"].apply(null, arguments);
        });
        var dynCall_viiifi = (Module["dynCall_viiifi"] = function () {
            return Module["asm"]["ui"].apply(null, arguments);
        });
        var dynCall_viiifii = (Module["dynCall_viiifii"] = function () {
            return Module["asm"]["vi"].apply(null, arguments);
        });
        var dynCall_viiii = (Module["dynCall_viiii"] = function () {
            return Module["asm"]["wi"].apply(null, arguments);
        });
        var dynCall_viiiif = (Module["dynCall_viiiif"] = function () {
            return Module["asm"]["xi"].apply(null, arguments);
        });
        var dynCall_viiiii = (Module["dynCall_viiiii"] = function () {
            return Module["asm"]["yi"].apply(null, arguments);
        });
        var dynCall_viiiiif = (Module["dynCall_viiiiif"] = function () {
            return Module["asm"]["zi"].apply(null, arguments);
        });
        var dynCall_viiiiii = (Module["dynCall_viiiiii"] = function () {
            return Module["asm"]["Ai"].apply(null, arguments);
        });
        var dynCall_viiiiiii = (Module["dynCall_viiiiiii"] = function () {
            return Module["asm"]["Bi"].apply(null, arguments);
        });
        var dynCall_viiiiiiii = (Module["dynCall_viiiiiiii"] = function () {
            return Module["asm"]["Ci"].apply(null, arguments);
        });
        var dynCall_viiiiiiiii = (Module["dynCall_viiiiiiiii"] = function () {
            return Module["asm"]["Di"].apply(null, arguments);
        });
        var dynCall_viiiiiiiiii = (Module["dynCall_viiiiiiiiii"] = function () {
            return Module["asm"]["Ei"].apply(null, arguments);
        });
        var dynCall_viiiiiiiiiiiiiii = (Module["dynCall_viiiiiiiiiiiiiii"] = function () {
            return Module["asm"]["Fi"].apply(null, arguments);
        });
        var dynCall_viiiiij = (Module["dynCall_viiiiij"] = function () {
            return Module["asm"]["Gi"].apply(null, arguments);
        });
        var dynCall_viiiij = (Module["dynCall_viiiij"] = function () {
            return Module["asm"]["Hi"].apply(null, arguments);
        });
        var dynCall_viij = (Module["dynCall_viij"] = function () {
            return Module["asm"]["Ii"].apply(null, arguments);
        });
        var dynCall_viji = (Module["dynCall_viji"] = function () {
            return Module["asm"]["Ji"].apply(null, arguments);
        });
        Module["asm"] = asm;
        Module["ccall"] = ccall;
        Module["cwrap"] = cwrap;
        var calledRun;
        Module["then"] = function (func) {
            if (calledRun) {
                func(Module);
            } else {
                var old = Module["onRuntimeInitialized"];
                Module["onRuntimeInitialized"] = function () {
                    if (old) old();
                    func(Module);
                };
            }
            return Module;
        };
        function ExitStatus(status) {
            this.name = "ExitStatus";
            this.message = "Program terminated with exit(" + status + ")";
            this.status = status;
        }
        dependenciesFulfilled = function runCaller() {
            if (!calledRun) run();
            if (!calledRun) dependenciesFulfilled = runCaller;
        };
        function run(args) {
            args = args || arguments_;
            if (runDependencies > 0) {
                return;
            }
            preRun();
            if (runDependencies > 0) return;
            function doRun() {
                if (calledRun) return;
                calledRun = true;
                if (ABORT) return;
                initRuntime();
                preMain();
                if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                postRun();
            }
            if (Module["setStatus"]) {
                Module["setStatus"]("Running...");
                setTimeout(function () {
                    setTimeout(function () {
                        Module["setStatus"]("");
                    }, 1);
                    doRun();
                }, 1);
            } else {
                doRun();
            }
        }
        Module["run"] = run;
        if (Module["preInit"]) {
            if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
            while (Module["preInit"].length > 0) {
                Module["preInit"].pop()();
            }
        }
        noExitRuntime = true;
        run();

        return IndigoModule;
    };
})();
if (typeof exports === "object" && typeof module === "object") module.exports = IndigoModule;
else if (typeof define === "function" && define["amd"])
    define([], function () {
        return IndigoModule;
    });
else if (typeof exports === "object") exports["IndigoModule"] = IndigoModule;
