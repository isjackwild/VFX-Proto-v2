/* Copyright (C) 1991-2012 Free Software Foundation, Inc.
   This file is part of the GNU C Library.

   The GNU C Library is free software; you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public
   License as published by the Free Software Foundation; either
   version 2.1 of the License, or (at your option) any later version.

   The GNU C Library is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
   Lesser General Public License for more details.

   You should have received a copy of the GNU Lesser General Public
   License along with the GNU C Library; if not, see
   <http://www.gnu.org/licenses/>.  */
/* This header is separate from features.h so that the compiler can
   include it implicitly at the start of every compilation.  It must
   not itself include <features.h> or any other header that includes
   <features.h> because the implicit include comes before any feature
   test macros that may be defined in a source file before it first
   explicitly includes a system header.  GCC knows the name of this
   header in order to preinclude it.  */
/* Define __STDC_IEC_559__ and other similar macros.  */
/* Copyright (C) 2005 Free Software Foundation, Inc.
   This file is part of the GNU C Library.

   The GNU C Library is free software; you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public
   License as published by the Free Software Foundation; either
   version 2.1 of the License, or (at your option) any later version.

   The GNU C Library is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
   Lesser General Public License for more details.

   You should have received a copy of the GNU Lesser General Public
   License along with the GNU C Library; if not, write to the Free
   Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
   02111-1307 USA.  */
/* We do support the IEC 559 math functionality, real and complex.  */
/* wchar_t uses ISO/IEC 10646 (2nd ed., published 2011-03-15) /
   Unicode 6.0.  */
/* We do not support C11 <threads.h>.  */
OgvJs = (function(options) {
 options = options || {};
 var self = this,
  processAudio = (options.audio !== undefined) ? !!options.audio : true,
  processVideo = (options.video !== undefined) ? !!options.video : true;
    var Module = {
     noInitialRun: true,
     noExitRuntime: true,
     TOTAL_MEMORY: 32 * 1024 * 1024, // default heap is 16M
     print: function(str) {
      console.log("OgvJs: " + str);
     }
    };
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  if (!Module['printErr']) Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function read(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };
  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };
  Module['load'] = function load(f) {
    globalEval(read(f));
  };
  Module['arguments'] = process['argv'].slice(2);
  module['exports'] = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }
  Module['readBinary'] = function readBinary(f) {
    return read(f, 'binary');
  };
  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  this['Module'] = Module;
  eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"); // wipe out the SpiderMonkey shell 'gc' function, which can confuse closure (uses it as a minified name, and it is then initted to a non-falsey value unexpectedly)
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }
  if (ENVIRONMENT_IS_WEB) {
    this['Module'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];
// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?\{ ?[^}]* ?\}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else if (field[0] === '<') {
        // vector type
        size = alignSize = Types.types[field].flatSize; // fully aligned
      } else if (field[0] === 'i') {
        // illegal integer field, that could not be legalized because it is an internal structure field
        // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
        size = alignSize = parseInt(field.substr(1))/8;
        assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
      } else {
        assert(false, 'invalid type for calculateStructAlignment');
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    if (type.name_ && type.name_[0] === '[') {
      // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
      // allocating a potentially huge array for [999999 x i8] etc.
      type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
    }
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    code = Pointer_stringify(code);
    if (code[0] === '"') {
      // tolerate EM_ASM("..code..") even though EM_ASM(..code..) is correct
      if (code.indexOf('"', 1) === code.length-1) {
        code = code.substr(1, code.length-2);
      } else {
        // something invalid happened, e.g. EM_ASM("..code($0)..", input)
        abort('invalid EM_ASM input |' + code + '|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)');
      }
    }
    return Runtime.asmConstCache[code] = eval('(function(' + args.join(',') + '){ ' + code + ' })'); // new Function does not allow upvars in node
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;
      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) { // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) { // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else { // 11110xxx
          needed = 3;
        }
        return '';
      }
      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6) | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6) | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*(+4294967296))) : ((+((low>>>0)))+((+((high|0)))*(+4294967296)))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
Module['Runtime'] = Runtime;
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      value = intArrayFromString(value);
      type = 'array';
    }
    if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= (+1) ? (tempDouble > (+0) ? ((Math_min((+(Math_floor((tempDouble)/(+4294967296)))), (+4294967295)))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/(+4294967296))))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;
  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;
// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
}
Module['stringToUTF16'] = stringToUTF16;
// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;
  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;
// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
}
Module['stringToUTF32'] = stringToUTF32;
function demangle(func) {
  try {
    // Special-case the entry point, since its name differs from other name mangling.
    if (func == 'Object._main' || func == '_main') {
      return 'main()';
    }
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    var i = 3;
    // params, etc.
    var basicTypes = {
      'v': 'void',
      'b': 'bool',
      'c': 'char',
      's': 'short',
      'i': 'int',
      'l': 'long',
      'f': 'float',
      'd': 'double',
      'w': 'wchar_t',
      'a': 'signed char',
      'h': 'unsigned char',
      't': 'unsigned short',
      'j': 'unsigned int',
      'm': 'unsigned long',
      'x': 'long long',
      'y': 'unsigned long long',
      'z': '...'
    };
    function dump(x) {
      //return;
      if (x) Module.print(x);
      Module.print(func);
      var pre = '';
      for (var a = 0; a < i; a++) pre += ' ';
      Module.print (pre + '^');
    }
    var subs = [];
    function parseNested() {
      i++;
      if (func[i] === 'K') i++; // ignore const
      var parts = [];
      while (func[i] !== 'E') {
        if (func[i] === 'S') { // substitution
          i++;
          var next = func.indexOf('_', i);
          var num = func.substring(i, next) || 0;
          parts.push(subs[num] || '?');
          i = next+1;
          continue;
        }
        if (func[i] === 'C') { // constructor
          parts.push(parts[parts.length-1]);
          i += 2;
          continue;
        }
        var size = parseInt(func.substr(i));
        var pre = size.toString().length;
        if (!size || !pre) { i--; break; } // counter i++ below us
        var curr = func.substr(i + pre, size);
        parts.push(curr);
        subs.push(curr);
        i += pre + size;
      }
      i++; // skip E
      return parts;
    }
    var first = true;
    function parse(rawList, limit, allowVoid) { // main parser
      limit = limit || Infinity;
      var ret = '', list = [];
      function flushList() {
        return '(' + list.join(', ') + ')';
      }
      var name;
      if (func[i] === 'N') {
        // namespaced N-E
        name = parseNested().join('::');
        limit--;
        if (limit === 0) return rawList ? [name] : name;
      } else {
        // not namespaced
        if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
        var size = parseInt(func.substr(i));
        if (size) {
          var pre = size.toString().length;
          name = func.substr(i + pre, size);
          i += pre + size;
        }
      }
      first = false;
      if (func[i] === 'I') {
        i++;
        var iList = parse(true);
        var iRet = parse(true, 1, true);
        ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
      } else {
        ret = name;
      }
      paramLoop: while (i < func.length && limit-- > 0) {
        //dump('paramLoop');
        var c = func[i++];
        if (c in basicTypes) {
          list.push(basicTypes[c]);
        } else {
          switch (c) {
            case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
            case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
            case 'L': { // literal
              i++; // skip basic type
              var end = func.indexOf('E', i);
              var size = end - i;
              list.push(func.substr(i, size));
              i += size + 2; // size + 'EE'
              break;
            }
            case 'A': { // array
              var size = parseInt(func.substr(i));
              i += size.toString().length;
              if (func[i] !== '_') throw '?';
              i++; // skip _
              list.push(parse(true, 1, true)[0] + ' [' + size + ']');
              break;
            }
            case 'E': break paramLoop;
            default: ret += '?' + c; break paramLoop;
          }
        }
      }
      if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
      return rawList ? list : ret + flushList();
    }
    return parse();
  } catch(e) {
    return func;
  }
}
function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}
function stackTrace() {
  var stack = new Error().stack;
  return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
}
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
var totalMemory = 4096;
while (totalMemory < TOTAL_MEMORY || totalMemory < 2*TOTAL_STACK) {
  if (totalMemory < 16*1024*1024) {
    totalMemory *= 2;
  } else {
    totalMemory += 16*1024*1024
  }
}
if (totalMemory !== TOTAL_MEMORY) {
  Module.printErr('increasing TOTAL_MEMORY to ' + totalMemory + ' to be more reasonable');
  TOTAL_MEMORY = totalMemory;
}
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATPRERUN__ = []; // functions called before the runtime is initialized
var __ATINIT__ = []; // functions called during startup
var __ATMAIN__ = []; // functions called when main() is to be run
var __ATEXIT__ = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited
var runtimeInitialized = false;
function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;
function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;
function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;
function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;
// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr;
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0;
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;
function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits) + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
  var ah = a >>> 16;
  var al = a & 0xffff;
  var bh = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];
var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
var memoryInitializer = null;
// === Body ===
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + Runtime.alignMemory(64227);
/* global initializers */ __ATINIT__.push();
/* memory initializer */ allocate([0,0,0,0,1,0,0,0,3,0,0,0,7,0,0,0,15,0,0,0,31,0,0,0,63,0,0,0,127,0,0,0,255,0,0,0,255,1,0,0,255,3,0,0,255,7,0,0,255,15,0,0,255,31,0,0,255,63,0,0,255,127,0,0,255,255,0,0,255,255,1,0,255,255,3,0,255,255,7,0,255,255,15,0,255,255,31,0,255,255,63,0,255,255,127,0,255,255,255,0,255,255,255,1,255,255,255,3,255,255,255,7,255,255,255,15,255,255,255,31,255,255,255,63,255,255,255,127,255,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255,255,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,84,104,101,111,114,97,32,100,101,99,111,100,101,114,32,102,97,105,108,101,100,32,109,121,115,116,101,114,105,111,117,115,108,121,63,32,37,100,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,86,111,114,98,105,115,32,100,101,99,111,100,101,114,32,102,97,105,108,101,100,32,109,121,115,116,101,114,105,111,117,115,108,121,63,32,37,100,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,112,114,111,99,101,115,115,72,101,97,100,101,114,115,32,112,97,115,115,46,46,46,32,37,100,32,37,100,32,37,100,10,0,0,0,0,0,0,0,0,69,114,114,111,114,32,114,101,97,100,105,110,103,32,116,104,101,111,114,97,32,104,101,97,100,101,114,115,58,32,37,100,46,10,0,0,0,0,0,0,69,114,114,111,114,32,114,101,97,100,105,110,103,32,118,111,114,98,105,115,32,104,101,97,100,101,114,115,58,32,37,100,46,10,0,0,0,0,0,0,116,104,101,111,114,97,95,112,32,105,115,32,37,100,59,32,118,111,114,98,105,115,95,112,32,105,115,32,37,100,10,0,79,103,103,32,108,111,103,105,99,97,108,32,115,116,114,101,97,109,32,37,108,120,32,105,115,32,84,104,101,111,114,97,32,37,100,120,37,100,32,37,46,48,50,102,32,102,112,115,32,118,105,100,101,111,10,69,110,99,111,100,101,100,32,102,114,97,109,101,32,99,111,110,116,101,110,116,32,105,115,32,37,100,120,37,100,32,119,105,116,104,32,37,100,120,37,100,32,111,102,102,115,101,116,10,0,0,0,0,0,0,0,0,79,103,103,32,108,111,103,105,99,97,108,32,115,116,114,101,97,109,32,37,108,120,32,105,115,32,86,111,114,98,105,115,32,37,100,32,99,104,97,110,110,101,108,32,37,108,100,32,72,122,32,97,117,100,105,111,46,10,0,0,0,0,0,0,69,110,99,111,100,101,100,32,98,121,32,37,115,10,0,0,9,37,46,42,115,10,0,0,102,111,117,110,100,32,118,111,114,98,105,115,32,115,116,114,101,97,109,33,32,37,100,10,0,0,0,0,0,0,0,0,68,117,112,108,105,99,97,116,101,32,102,114,97,109,101,0,84,104,101,111,114,97,32,112,97,99,107,101,116,32,100,105,100,110,39,116,32,99,111,109,101,32,111,117,116,32,111,102,32,115,116,114,101,97,109,0,68,111,110,101,32,119,105,116,104,32,104,101,97,100,101,114,115,32,115,116,101,112,0,0,83,69,84,84,73,78,71,32,85,80,32,84,72,69,79,82,65,32,68,69,67,79,68,69,82,32,67,79,78,84,69,88,84,0,0,0,0,0,0,0,99,104,101,99,107,105,110,103,32,118,111,114,98,105,115,32,104,101,97,100,101,114,115,46,46,46,0,0,0,0,0,0,78,111,32,118,111,114,98,105,115,32,104,101,97,100,101,114,32,112,97,99,107,101,116,46,46,46,0,0,0,0,0,0,67,104,101,99,107,105,110,103,32,97,110,111,116,104,101,114,32,118,111,114,98,105,115,32,104,101,97,100,101,114,32,112,97,99,107,101,116,46,46,46,0,0,0,0,0,0,0,0,73,110,118,97,108,105,100,32,118,111,114,98,105,115,32,104,101,97,100,101,114,63,0,0,67,111,109,112,108,101,116,101,100,32,97,110,111,116,104,101,114,32,118,111,114,98,105,115,32,104,101,97,100,101,114,32,40,111,102,32,51,32,116,111,116,97,108,41,46,46,46,0,99,104,101,99,107,105,110,103,32,116,104,101,111,114,97,32,104,101,97,100,101,114,115,46,46,46,0,0,0,0,0,0,78,111,32,116,104,101,111,114,97,32,104,101,97,100,101,114,32,112,97,99,107,101,116,46,46,46,0,0,0,0,0,0,67,104,101,99,107,105,110,103,32,97,110,111,116,104,101,114,32,116,104,101,111,114,97,32,104,101,97,100,101,114,32,112,97,99,107,101,116,46,46,46,0,0,0,0,0,0,0,0,83,116,105,108,108,32,112,97,114,115,105,110,103,32,116,104,101,111,114,97,32,104,101,97,100,101,114,115,46,46,46,0,67,111,109,112,108,101,116,101,100,32,116,104,101,111,114,97,32,104,101,97,100,101,114,46,0,0,0,0,0,0,0,0,116,104,101,111,114,97,32,99,111,109,109,101,110,116,32,104,101,97,100,101,114,58,0,0,77,111,118,105,110,103,32,111,110,32,116,111,32,104,101,97,100,101,114,32,100,101,99,111,100,105,110,103,46,46,46,0,80,97,99,107,101,116,32,105,115,32,97,116,32,115,116,97,114,116,32,111,102,32,97,32,98,105,116,115,116,114,101,97,109,0,0,0,0,0,0,0,97,108,114,101,97,100,121,32,104,97,118,101,32,115,116,114,101,97,109,44,32,111,114,32,110,111,116,32,116,104,101,111,114,97,32,111,114,32,118,111,114,98,105,115,32,112,97,99,107,101,116,0,0,0,0,0,102,111,117,110,100,32,116,104,101,111,114,97,32,115,116,114,101,97,109,33,0,0,0,0,83,97,118,105,110,103,32,102,105,114,115,116,32,118,105,100,101,111,32,112,97,99,107,101,116,32,102,111,114,32,108,97,116,101,114,33,0,0,0,0,0,0,0,0,183,29,193,4,110,59,130,9,217,38,67,13,220,118,4,19,107,107,197,23,178,77,134,26,5,80,71,30,184,237,8,38,15,240,201,34,214,214,138,47,97,203,75,43,100,155,12,53,211,134,205,49,10,160,142,60,189,189,79,56,112,219,17,76,199,198,208,72,30,224,147,69,169,253,82,65,172,173,21,95,27,176,212,91,194,150,151,86,117,139,86,82,200,54,25,106,127,43,216,110,166,13,155,99,17,16,90,103,20,64,29,121,163,93,220,125,122,123,159,112,205,102,94,116,224,182,35,152,87,171,226,156,142,141,161,145,57,144,96,149,60,192,39,139,139,221,230,143,82,251,165,130,229,230,100,134,88,91,43,190,239,70,234,186,54,96,169,183,129,125,104,179,132,45,47,173,51,48,238,169,234,22,173,164,93,11,108,160,144,109,50,212,39,112,243,208,254,86,176,221,73,75,113,217,76,27,54,199,251,6,247,195,34,32,180,206,149,61,117,202,40,128,58,242,159,157,251,246,70,187,184,251,241,166,121,255,244,246,62,225,67,235,255,229,154,205,188,232,45,208,125,236,119,112,134,52,192,109,71,48,25,75,4,61,174,86,197,57,171,6,130,39,28,27,67,35,197,61,0,46,114,32,193,42,207,157,142,18,120,128,79,22,161,166,12,27,22,187,205,31,19,235,138,1,164,246,75,5,125,208,8,8,202,205,201,12,7,171,151,120,176,182,86,124,105,144,21,113,222,141,212,117,219,221,147,107,108,192,82,111,181,230,17,98,2,251,208,102,191,70,159,94,8,91,94,90,209,125,29,87,102,96,220,83,99,48,155,77,212,45,90,73,13,11,25,68,186,22,216,64,151,198,165,172,32,219,100,168,249,253,39,165,78,224,230,161,75,176,161,191,252,173,96,187,37,139,35,182,146,150,226,178,47,43,173,138,152,54,108,142,65,16,47,131,246,13,238,135,243,93,169,153,68,64,104,157,157,102,43,144,42,123,234,148,231,29,180,224,80,0,117,228,137,38,54,233,62,59,247,237,59,107,176,243,140,118,113,247,85,80,50,250,226,77,243,254,95,240,188,198,232,237,125,194,49,203,62,207,134,214,255,203,131,134,184,213,52,155,121,209,237,189,58,220,90,160,251,216,238,224,12,105,89,253,205,109,128,219,142,96,55,198,79,100,50,150,8,122,133,139,201,126,92,173,138,115,235,176,75,119,86,13,4,79,225,16,197,75,56,54,134,70,143,43,71,66,138,123,0,92,61,102,193,88,228,64,130,85,83,93,67,81,158,59,29,37,41,38,220,33,240,0,159,44,71,29,94,40,66,77,25,54,245,80,216,50,44,118,155,63,155,107,90,59,38,214,21,3,145,203,212,7,72,237,151,10,255,240,86,14,250,160,17,16,77,189,208,20,148,155,147,25,35,134,82,29,14,86,47,241,185,75,238,245,96,109,173,248,215,112,108,252,210,32,43,226,101,61,234,230,188,27,169,235,11,6,104,239,182,187,39,215,1,166,230,211,216,128,165,222,111,157,100,218,106,205,35,196,221,208,226,192,4,246,161,205,179,235,96,201,126,141,62,189,201,144,255,185,16,182,188,180,167,171,125,176,162,251,58,174,21,230,251,170,204,192,184,167,123,221,121,163,198,96,54,155,113,125,247,159,168,91,180,146,31,70,117,150,26,22,50,136,173,11,243,140,116,45,176,129,195,48,113,133,153,144,138,93,46,141,75,89,247,171,8,84,64,182,201,80,69,230,142,78,242,251,79,74,43,221,12,71,156,192,205,67,33,125,130,123,150,96,67,127,79,70,0,114,248,91,193,118,253,11,134,104,74,22,71,108,147,48,4,97,36,45,197,101,233,75,155,17,94,86,90,21,135,112,25,24,48,109,216,28,53,61,159,2,130,32,94,6,91,6,29,11,236,27,220,15,81,166,147,55,230,187,82,51,63,157,17,62,136,128,208,58,141,208,151,36,58,205,86,32,227,235,21,45,84,246,212,41,121,38,169,197,206,59,104,193,23,29,43,204,160,0,234,200,165,80,173,214,18,77,108,210,203,107,47,223,124,118,238,219,193,203,161,227,118,214,96,231,175,240,35,234,24,237,226,238,29,189,165,240,170,160,100,244,115,134,39,249,196,155,230,253,9,253,184,137,190,224,121,141,103,198,58,128,208,219,251,132,213,139,188,154,98,150,125,158,187,176,62,147,12,173,255,151,177,16,176,175,6,13,113,171,223,43,50,166,104,54,243,162,109,102,180,188,218,123,117,184,3,93,54,181,180,64,247,177,79,103,103,83,0,0,0,0,118,111,114,98,105,115,0,0,0,0,76,194,0,0,80,194,0,0,84,194,0,0,88,194,0,0,92,194,0,0,96,194,0,0,100,194,0,0,104,194,0,0,108,194,0,0,112,194,0,0,116,194,0,0,120,194,0,0,124,194,0,0,128,194,0,0,130,194,0,0,132,194,0,0,134,194,0,0,136,194,0,0,138,194,0,0,140,194,0,0,142,194,0,0,144,194,0,0,146,194,0,0,148,194,0,0,150,194,0,0,152,194,0,0,154,194,0,0,156,194,0,0,160,194,0,0,162,194,0,0,164,194,0,0,166,194,0,0,168,194,0,0,170,194,0,0,172,194,0,0,174,194,0,0,176,194,0,0,176,194,0,0,178,194,0,0,178,194,0,0,180,194,0,0,182,194,0,0,182,194,0,0,184,194,0,0,186,194,0,0,188,194,0,0,190,194,0,0,192,194,0,0,192,194,0,0,194,194,0,0,196,194,0,0,196,194,0,0,198,194,0,0,198,194,0,0,200,194,0,0,200,194,0,0,202,194,0,0,204,194,0,0,206,194,0,0,208,194,0,0,212,194,0,0,214,194,0,0,214,194,0,0,214,194,0,0,214,194,0,0,210,194,0,0,206,194,0,0,204,194,0,0,202,194,0,0,198,194,0,0,196,194,0,0,192,194,0,0,190,194,0,0,190,194,0,0,192,194,0,0,194,194,0,0,192,194,0,0,190,194,0,0,186,194,0,0,180,194,0,0,160,194,0,0,140,194,0,0,72,194,0,0,32,194,0,0,240,193,0,0,240,193,0,0,240,193,0,0,240,193,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,63,0,0,0,0,0,0,240,63,0,0,0,0,0,0,248,63,0,0,0,0,0,0,4,64,0,0,0,0,0,0,18,64,0,0,0,0,0,0,33,64,0,0,0,0,0,128,48,64,0,0,0,4,107,244,52,66,0,0,0,0,0,0,0,0,0,0,0,0,0,0,224,63,0,0,0,0,0,0,240,63,0,0,0,0,0,0,248,63,0,0,0,0,0,0,0,64,0,0,0,0,0,0,4,64,0,0,0,0,0,0,18,64,0,0,0,0,0,0,33,64,0,0,0,4,107,244,52,66,62,180,228,51,9,145,243,51,139,178,1,52,60,32,10,52,35,26,19,52,96,169,28,52,167,215,38,52,75,175,49,52,80,59,61,52,112,135,73,52,35,160,86,52,184,146,100,52,85,109,115,52,136,159,129,52,252,11,138,52,147,4,147,52,105,146,156,52,50,191,166,52,63,149,177,52,147,31,189,52,228,105,201,52,173,128,214,52,54,113,228,52,166,73,243,52,136,140,1,53,192,247,9,53,6,239,18,53,118,123,28,53,192,166,38,53,55,123,49,53,218,3,61,53,94,76,73,53,59,97,86,53,185,79,100,53,252,37,115,53,138,121,129,53,134,227,137,53,124,217,146,53,133,100,156,53,82,142,166,53,51,97,177,53,37,232,188,53,220,46,201,53,206,65,214,53,65,46,228,53,87,2,243,53,143,102,1,54,79,207,9,54,245,195,18,54,152,77,28,54,232,117,38,54,50,71,49,54,116,204,60,54,94,17,73,54,101,34,86,54,206,12,100,54,184,222,114,54,151,83,129,54,28,187,137,54,114,174,146,54,175,54,156,54,129,93,166,54,53,45,177,54,199,176,188,54,228,243,200,54,1,3,214,54,96,235,227,54,30,187,242,54,162,64,1,55,235,166,9,55,241,152,18,55,201,31,28,55,30,69,38,55,61,19,49,55,30,149,60,55,111,214,72,55,162,227,85,55,247,201,99,55,137,151,114,55,175,45,129,55,190,146,137,55,116,131,146,55,230,8,156,55,190,44,166,55,71,249,176,55,121,121,188,55,254,184,200,55,71,196,213,55,146,168,227,55,248,115,242,55,192,26,1,56,147,126,9,56,249,109,18,56,6,242,27,56,98,20,38,56,86,223,48,56,216,93,60,56,146,155,72,56,242,164,85,56,51,135,99,56,110,80,114,56,211,7,129,56,107,106,137,56,130,88,146,56,42,219,155,56,9,252,165,56,104,197,176,56,59,66,188,56,41,126,200,56,160,133,213,56,217,101,227,56,232,44,242,56,233,244,0,57,70,86,9,57,14,67,18,57,81,196,27,57,181,227,37,57,127,171,48,57,162,38,60,57,197,96,72,57,83,102,85,57,131,68,99,57,104,9,114,57,1,226,128,57,36,66,137,57,157,45,146,57,123,173,155,57,99,203,165,57,153,145,176,57,13,11,188,57,102,67,200,57,11,71,213,57,50,35,227,57,237,229,241,57,29,207,0,58,5,46,9,58,48,24,18,58,169,150,27,58,21,179,37,58,183,119,48,58,124,239,59,58,10,38,72,58,199,39,85,58,230,1,99,58,120,194,113,58,59,188,128,58,233,25,137,58,198,2,146,58,219,127,155,58,203,154,165,58,216,93,176,58,239,211,187,58,179,8,200,58,136,8,213,58,159,224,226,58,7,159,241,58,92,169,0,59,208,5,9,59,94,237,17,59,15,105,27,59,132,130,37,59,253,67,48,59,103,184,59,59,97,235,71,59,77,233,84,59,93,191,98,59,156,123,113,59,127,150,128,59,186,241,136,59,249,215,145,59,71,82,155,59,65,106,165,59,39,42,176,59,226,156,187,59,18,206,199,59,23,202,212,59,32,158,226,59,53,88,241,59,166,131,0,60,167,221,8,60,152,194,17,60,130,59,27,60,1,82,37,60,84,16,48,60,97,129,59,60,200,176,71,60,229,170,84,60,232,124,98,60,212,52,113,60,207,112,128,60,150,201,136,60,58,173,145,60,192,36,155,60,197,57,165,60,133,246,175,60,229,101,187,60,130,147,199,60,185,139,212,60,180,91,226,60,121,17,241,60,251,93,0,61,137,181,8,61,223,151,17,61,2,14,27,61,141,33,37,61,185,220,47,61,109,74,59,61,64,118,71,61,145,108,84,61,133,58,98,61,34,238,112,61,42,75,128,61,127,161,136,61,136,130,145,61,72,247,154,61,88,9,165,61,242,194,175,61,248,46,187,61,3,89,199,61,109,77,212,61,92,25,226,61,209,202,240,61,91,56,0,62,119,141,8,62,51,109,17,62,144,224,26,62,39,241,36,62,46,169,47,62,135,19,59,62,202,59,71,62,77,46,84,62,55,248,97,62,132,167,112,62,143,37,128,62,115,121,136,62,226,87,145,62,220,201,154,62,249,216,164,62,109,143,175,62,27,248,186,62,149,30,199,62,51,15,212,62,23,215,225,62,61,132,240,62,198,18,0,63,114,101,8,63,147,66,17,63,43,179,26,63,206,192,36,63,177,117,47,63,178,220,58,63,101,1,71,63,29,240,83,63,251,181,97,63,251,96,112,63,0,0,128,63,0,0,112,194,0,0,112,194,0,0,112,194,0,0,112,194,0,0,112,194,0,0,112,194,0,0,112,194,0,0,112,194,0,0,112,194,0,0,112,194,0,0,112,194,0,0,112,194,0,0,120,194,0,0,120,194,0,0,130,194,0,0,146,194,0,0,138,194,0,0,136,194,0,0,136,194,0,0,134,194,0,0,140,194,0,0,140,194,0,0,144,194,0,0,148,194,0,0,150,194,0,0,158,194,0,0,158,194,0,0,160,194,0,0,166,194,0,0,176,194,0,0,186,194,0,0,200,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,64,194,0,0,64,194,0,0,64,194,0,0,64,194,0,0,64,194,0,0,64,194,0,0,64,194,0,0,64,194,0,0,64,194,0,0,64,194,0,0,64,194,0,0,64,194,0,0,64,194,0,0,84,194,0,0,116,194,0,0,132,194,0,0,132,194,0,0,136,194,0,0,134,194,0,0,140,194,0,0,152,194,0,0,152,194,0,0,144,194,0,0,146,194,0,0,150,194,0,0,152,194,0,0,156,194,0,0,158,194,0,0,166,194,0,0,176,194,0,0,186,194,0,0,200,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,20,194,0,0,20,194,0,0,20,194,0,0,20,194,0,0,20,194,0,0,20,194,0,0,20,194,0,0,20,194,0,0,24,194,0,0,32,194,0,0,40,194,0,0,56,194,0,0,64,194,0,0,84,194,0,0,92,194,0,0,120,194,0,0,130,194,0,0,104,194,0,0,96,194,0,0,96,194,0,0,116,194,0,0,112,194,0,0,130,194,0,0,134,194,0,0,138,194,0,0,142,194,0,0,154,194,0,0,154,194,0,0,156,194,0,0,160,194,0,0,164,194,0,0,168,194,0,0,176,194,0,0,186,194,0,0,196,194,0,0,212,194,0,0,224,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,200,193,0,0,200,193,0,0,200,193,0,0,200,193,0,0,200,193,0,0,200,193,0,0,200,193,0,0,200,193,0,0,200,193,0,0,208,193,0,0,216,193,0,0,232,193,0,0,0,194,0,0,24,194,0,0,64,194,0,0,80,194,0,0,80,194,0,0,72,194,0,0,64,194,0,0,64,194,0,0,76,194,0,0,80,194,0,0,88,194,0,0,112,194,0,0,134,194,0,0,134,194,0,0,132,194,0,0,136,194,0,0,138,194,0,0,146,194,0,0,146,194,0,0,152,194,0,0,160,194,0,0,162,194,0,0,162,194,0,0,170,194,0,0,170,194,0,0,172,194,0,0,176,194,0,0,186,194,0,0,200,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,128,193,0,0,128,193,0,0,128,193,0,0,128,193,0,0,128,193,0,0,128,193,0,0,128,193,0,0,128,193,0,0,136,193,0,0,152,193,0,0,160,193,0,0,176,193,0,0,208,193,0,0,224,193,0,0,248,193,0,0,32,194,0,0,60,194,0,0,28,194,0,0,28,194,0,0,32,194,0,0,40,194,0,0,44,194,0,0,60,194,0,0,76,194,0,0,100,194,0,0,80,194,0,0,92,194,0,0,92,194,0,0,112,194,0,0,104,194,0,0,120,194,0,0,124,194,0,0,140,194,0,0,134,194,0,0,138,194,0,0,144,194,0,0,146,194,0,0,154,194,0,0,160,194,0,0,164,194,0,0,166,194,0,0,174,194,0,0,180,194,0,0,188,194,0,0,196,194,0,0,208,194,0,0,230,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,0,193,0,0,0,193,0,0,0,193,0,0,0,193,0,0,0,193,0,0,0,193,0,0,0,193,0,0,0,193,0,0,0,193,0,0,0,193,0,0,32,193,0,0,48,193,0,0,112,193,0,0,152,193,0,0,200,193,0,0,240,193,0,0,8,194,0,0,248,193,0,0,240,193,0,0,248,193,0,0,232,193,0,0,0,194,0,0,12,194,0,0,40,194,0,0,64,194,0,0,40,194,0,0,48,194,0,0,56,194,0,0,72,194,0,0,72,194,0,0,76,194,0,0,80,194,0,0,108,194,0,0,88,194,0,0,92,194,0,0,92,194,0,0,104,194,0,0,120,194,0,0,124,194,0,0,132,194,0,0,144,194,0,0,146,194,0,0,152,194,0,0,150,194,0,0,156,194,0,0,160,194,0,0,160,194,0,0,162,194,0,0,168,194,0,0,176,194,0,0,180,194,0,0,188,194,0,0,196,194,0,0,202,194,0,0,212,194,0,0,220,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,134,194,0,0,134,194,0,0,134,194,0,0,152,194,0,0,144,194,0,0,142,194,0,0,148,194,0,0,152,194,0,0,152,194,0,0,150,194,0,0,156,194,0,0,158,194,0,0,158,194,0,0,162,194,0,0,166,194,0,0,172,194,0,0,178,194,0,0,186,194,0,0,194,194,0,0,200,194,0,0,210,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,60,194,0,0,60,194,0,0,60,194,0,0,60,194,0,0,60,194,0,0,60,194,0,0,60,194,0,0,60,194,0,0,60,194,0,0,60,194,0,0,60,194,0,0,64,194,0,0,76,194,0,0,92,194,0,0,108,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,134,194,0,0,132,194,0,0,136,194,0,0,138,194,0,0,140,194,0,0,148,194,0,0,158,194,0,0,154,194,0,0,154,194,0,0,156,194,0,0,160,194,0,0,162,194,0,0,164,194,0,0,168,194,0,0,172,194,0,0,176,194,0,0,182,194,0,0,190,194,0,0,200,194,0,0,216,194,0,0,232,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,16,194,0,0,16,194,0,0,16,194,0,0,16,194,0,0,16,194,0,0,16,194,0,0,16,194,0,0,16,194,0,0,16,194,0,0,20,194,0,0,20,194,0,0,36,194,0,0,48,194,0,0,64,194,0,0,76,194,0,0,104,194,0,0,120,194,0,0,112,194,0,0,100,194,0,0,108,194,0,0,108,194,0,0,112,194,0,0,124,194,0,0,130,194,0,0,144,194,0,0,142,194,0,0,140,194,0,0,144,194,0,0,148,194,0,0,154,194,0,0,152,194,0,0,156,194,0,0,162,194,0,0,162,194,0,0,160,194,0,0,166,194,0,0,172,194,0,0,182,194,0,0,192,194,0,0,200,194,0,0,210,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,224,193,0,0,224,193,0,0,224,193,0,0,224,193,0,0,224,193,0,0,224,193,0,0,224,193,0,0,224,193,0,0,224,193,0,0,240,193,0,0,0,194,0,0,0,194,0,0,4,194,0,0,12,194,0,0,36,194,0,0,68,194,0,0,72,194,0,0,68,194,0,0,60,194,0,0,64,194,0,0,64,194,0,0,80,194,0,0,76,194,0,0,100,194,0,0,130,194,0,0,116,194,0,0,108,194,0,0,116,194,0,0,128,194,0,0,138,194,0,0,140,194,0,0,148,194,0,0,154,194,0,0,154,194,0,0,156,194,0,0,162,194,0,0,168,194,0,0,170,194,0,0,174,194,0,0,180,194,0,0,184,194,0,0,192,194,0,0,200,194,0,0,214,194,0,0,224,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,152,193,0,0,152,193,0,0,152,193,0,0,152,193,0,0,152,193,0,0,152,193,0,0,152,193,0,0,152,193,0,0,160,193,0,0,168,193,0,0,184,193,0,0,216,193,0,0,240,193,0,0,12,194,0,0,16,194,0,0,36,194,0,0,56,194,0,0,48,194,0,0,40,194,0,0,32,194,0,0,36,194,0,0,36,194,0,0,44,194,0,0,64,194,0,0,92,194,0,0,84,194,0,0,80,194,0,0,84,194,0,0,96,194,0,0,108,194,0,0,104,194,0,0,112,194,0,0,134,194,0,0,132,194,0,0,138,194,0,0,142,194,0,0,144,194,0,0,150,194,0,0,158,194,0,0,162,194,0,0,168,194,0,0,174,194,0,0,180,194,0,0,186,194,0,0,194,194,0,0,202,194,0,0,214,194,0,0,228,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,16,193,0,0,16,193,0,0,16,193,0,0,16,193,0,0,16,193,0,0,16,193,0,0,16,193,0,0,16,193,0,0,48,193,0,0,64,193,0,0,64,193,0,0,112,193,0,0,128,193,0,0,160,193,0,0,184,193,0,0,240,193,0,0,20,194,0,0,8,194,0,0,4,194,0,0,8,194,0,0,248,193,0,0,0,194,0,0,0,194,0,0,24,194,0,0,60,194,0,0,48,194,0,0,36,194,0,0,32,194,0,0,60,194,0,0,68,194,0,0,56,194,0,0,56,194,0,0,104,194,0,0,72,194,0,0,72,194,0,0,88,194,0,0,104,194,0,0,120,194,0,0,128,194,0,0,134,194,0,0,134,194,0,0,140,194,0,0,144,194,0,0,152,194,0,0,158,194,0,0,166,194,0,0,174,194,0,0,182,194,0,0,192,194,0,0,200,194,0,0,208,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,120,194,0,0,120,194,0,0,120,194,0,0,120,194,0,0,120,194,0,0,120,194,0,0,120,194,0,0,120,194,0,0,120,194,0,0,120,194,0,0,124,194,0,0,128,194,0,0,132,194,0,0,134,194,0,0,132,194,0,0,136,194,0,0,150,194,0,0,144,194,0,0,152,194,0,0,150,194,0,0,152,194,0,0,156,194,0,0,158,194,0,0,164,194,0,0,168,194,0,0,170,194,0,0,180,194,0,0,188,194,0,0,202,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,108,194,0,0,108,194,0,0,108,194,0,0,108,194,0,0,108,194,0,0,108,194,0,0,108,194,0,0,108,194,0,0,108,194,0,0,108,194,0,0,108,194,0,0,112,194,0,0,112,194,0,0,116,194,0,0,124,194,0,0,132,194,0,0,142,194,0,0,136,194,0,0,140,194,0,0,140,194,0,0,142,194,0,0,144,194,0,0,144,194,0,0,150,194,0,0,162,194,0,0,156,194,0,0,158,194,0,0,164,194,0,0,166,194,0,0,172,194,0,0,180,194,0,0,194,194,0,0,206,194,0,0,226,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,84,194,0,0,84,194,0,0,84,194,0,0,84,194,0,0,84,194,0,0,84,194,0,0,84,194,0,0,84,194,0,0,84,194,0,0,88,194,0,0,92,194,0,0,100,194,0,0,96,194,0,0,100,194,0,0,92,194,0,0,116,194,0,0,130,194,0,0,112,194,0,0,112,194,0,0,120,194,0,0,124,194,0,0,124,194,0,0,132,194,0,0,136,194,0,0,148,194,0,0,146,194,0,0,150,194,0,0,150,194,0,0,156,194,0,0,160,194,0,0,160,194,0,0,164,194,0,0,170,194,0,0,180,194,0,0,192,194,0,0,202,194,0,0,216,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,56,194,0,0,56,194,0,0,56,194,0,0,56,194,0,0,56,194,0,0,56,194,0,0,56,194,0,0,56,194,0,0,56,194,0,0,56,194,0,0,60,194,0,0,60,194,0,0,60,194,0,0,60,194,0,0,64,194,0,0,76,194,0,0,100,194,0,0,76,194,0,0,68,194,0,0,72,194,0,0,76,194,0,0,84,194,0,0,88,194,0,0,108,194,0,0,132,194,0,0,112,194,0,0,120,194,0,0,134,194,0,0,134,194,0,0,140,194,0,0,144,194,0,0,150,194,0,0,152,194,0,0,156,194,0,0,162,194,0,0,170,194,0,0,176,194,0,0,188,194,0,0,194,194,0,0,208,194,0,0,224,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,16,194,0,0,16,194,0,0,16,194,0,0,16,194,0,0,16,194,0,0,16,194,0,0,16,194,0,0,16,194,0,0,28,194,0,0,36,194,0,0,40,194,0,0,40,194,0,0,28,194,0,0,24,194,0,0,36,194,0,0,44,194,0,0,80,194,0,0,48,194,0,0,32,194,0,0,28,194,0,0,20,194,0,0,20,194,0,0,32,194,0,0,60,194,0,0,88,194,0,0,72,194,0,0,64,194,0,0,72,194,0,0,92,194,0,0,116,194,0,0,108,194,0,0,120,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,138,194,0,0,138,194,0,0,146,194,0,0,148,194,0,0,148,194,0,0,150,194,0,0,154,194,0,0,158,194,0,0,164,194,0,0,174,194,0,0,182,194,0,0,190,194,0,0,200,194,0,0,216,194,0,0,230,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,224,193,0,0,208,193,0,0,192,193,0,0,176,193,0,0,160,193,0,0,160,193,0,0,184,193,0,0,232,193,0,0,240,193,0,0,248,193,0,0,224,193,0,0,216,193,0,0,224,193,0,0,224,193,0,0,224,193,0,0,12,194,0,0,32,194,0,0,4,194,0,0,0,194,0,0,232,193,0,0,240,193,0,0,240,193,0,0,240,193,0,0,20,194,0,0,52,194,0,0,36,194,0,0,20,194,0,0,24,194,0,0,52,194,0,0,60,194,0,0,60,194,0,0,64,194,0,0,84,194,0,0,68,194,0,0,64,194,0,0,72,194,0,0,68,194,0,0,68,194,0,0,76,194,0,0,80,194,0,0,104,194,0,0,96,194,0,0,100,194,0,0,96,194,0,0,112,194,0,0,116,194,0,0,120,194,0,0,140,194,0,0,144,194,0,0,148,194,0,0,156,194,0,0,166,194,0,0,176,194,0,0,186,194,0,0,200,194,0,0,212,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,210,194,0,0,200,194,0,0,190,194,0,0,182,194,0,0,174,194,0,0,166,194,0,0,160,194,0,0,156,194,0,0,152,194,0,0,156,194,0,0,156,194,0,0,162,194,0,0,166,194,0,0,170,194,0,0,172,194,0,0,170,194,0,0,172,194,0,0,174,194,0,0,180,194,0,0,194,194,0,0,214,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,210,194,0,0,200,194,0,0,190,194,0,0,180,194,0,0,170,194,0,0,162,194,0,0,154,194,0,0,146,194,0,0,140,194,0,0,134,194,0,0,134,194,0,0,136,194,0,0,150,194,0,0,146,194,0,0,140,194,0,0,138,194,0,0,140,194,0,0,144,194,0,0,150,194,0,0,158,194,0,0,168,194,0,0,166,194,0,0,168,194,0,0,172,194,0,0,176,194,0,0,178,194,0,0,178,194,0,0,186,194,0,0,196,194,0,0,210,194,0,0,224,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,200,194,0,0,190,194,0,0,180,194,0,0,170,194,0,0,160,194,0,0,152,194,0,0,142,194,0,0,136,194,0,0,136,194,0,0,130,194,0,0,124,194,0,0,124,194,0,0,120,194,0,0,120,194,0,0,128,194,0,0,130,194,0,0,128,194,0,0,116,194,0,0,120,194,0,0,124,194,0,0,128,194,0,0,132,194,0,0,136,194,0,0,146,194,0,0,146,194,0,0,148,194,0,0,150,194,0,0,152,194,0,0,162,194,0,0,166,194,0,0,170,194,0,0,176,194,0,0,178,194,0,0,184,194,0,0,190,194,0,0,200,194,0,0,216,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,160,194,0,0,150,194,0,0,142,194,0,0,136,194,0,0,130,194,0,0,124,194,0,0,120,194,0,0,116,194,0,0,116,194,0,0,116,194,0,0,116,194,0,0,108,194,0,0,96,194,0,0,100,194,0,0,84,194,0,0,72,194,0,0,104,194,0,0,80,194,0,0,72,194,0,0,72,194,0,0,80,194,0,0,84,194,0,0,88,194,0,0,104,194,0,0,134,194,0,0,124,194,0,0,134,194,0,0,136,194,0,0,144,194,0,0,150,194,0,0,156,194,0,0,160,194,0,0,162,194,0,0,162,194,0,0,164,194,0,0,170,194,0,0,178,194,0,0,180,194,0,0,186,194,0,0,194,194,0,0,202,194,0,0,214,194,0,0,228,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,130,194,0,0,116,194,0,0,108,194,0,0,100,194,0,0,96,194,0,0,92,194,0,0,92,194,0,0,96,194,0,0,96,194,0,0,100,194,0,0,92,194,0,0,84,194,0,0,80,194,0,0,60,194,0,0,48,194,0,0,48,194,0,0,72,194,0,0,48,194,0,0,36,194,0,0,28,194,0,0,28,194,0,0,40,194,0,0,32,194,0,0,56,194,0,0,76,194,0,0,68,194,0,0,72,194,0,0,84,194,0,0,88,194,0,0,124,194], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);
/* memory initializer */ allocate([0,0,112,194,0,0,116,194,0,0,120,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,140,194,0,0,146,194,0,0,148,194,0,0,150,194,0,0,152,194,0,0,150,194,0,0,158,194,0,0,170,194,0,0,178,194,0,0,182,194,0,0,192,194,0,0,204,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,80,194,0,0,72,194,0,0,68,194,0,0,68,194,0,0,64,194,0,0,64,194,0,0,64,194,0,0,68,194,0,0,72,194,0,0,72,194,0,0,68,194,0,0,56,194,0,0,44,194,0,0,28,194,0,0,12,194,0,0,4,194,0,0,24,194,0,0,16,194,0,0,0,194,0,0,232,193,0,0,0,194,0,0,0,194,0,0,0,194,0,0,12,194,0,0,48,194,0,0,28,194,0,0,24,194,0,0,24,194,0,0,56,194,0,0,72,194,0,0,52,194,0,0,56,194,0,0,84,194,0,0,72,194,0,0,72,194,0,0,72,194,0,0,88,194,0,0,88,194,0,0,84,194,0,0,84,194,0,0,96,194,0,0,100,194,0,0,108,194,0,0,132,194,0,0,140,194,0,0,144,194,0,0,148,194,0,0,158,194,0,0,166,194,0,0,170,194,0,0,180,194,0,0,194,194,0,0,228,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,210,194,0,0,200,194,0,0,190,194,0,0,180,194,0,0,172,194,0,0,160,194,0,0,150,194,0,0,150,194,0,0,158,194,0,0,160,194,0,0,158,194,0,0,160,194,0,0,162,194,0,0,164,194,0,0,176,194,0,0,190,194,0,0,206,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,216,194,0,0,206,194,0,0,196,194,0,0,186,194,0,0,176,194,0,0,166,194,0,0,158,194,0,0,156,194,0,0,150,194,0,0,142,194,0,0,134,194,0,0,136,194,0,0,146,194,0,0,146,194,0,0,144,194,0,0,146,194,0,0,150,194,0,0,154,194,0,0,160,194,0,0,164,194,0,0,176,194,0,0,186,194,0,0,200,194,0,0,214,194,0,0,228,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,210,194,0,0,202,194,0,0,192,194,0,0,180,194,0,0,172,194,0,0,162,194,0,0,154,194,0,0,146,194,0,0,138,194,0,0,132,194,0,0,116,194,0,0,120,194,0,0,132,194,0,0,128,194,0,0,120,194,0,0,130,194,0,0,132,194,0,0,140,194,0,0,144,194,0,0,152,194,0,0,162,194,0,0,160,194,0,0,168,194,0,0,180,194,0,0,190,194,0,0,204,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,214,194,0,0,206,194,0,0,194,194,0,0,184,194,0,0,176,194,0,0,166,194,0,0,158,194,0,0,148,194,0,0,140,194,0,0,132,194,0,0,108,194,0,0,84,194,0,0,104,194,0,0,120,194,0,0,92,194,0,0,88,194,0,0,88,194,0,0,88,194,0,0,104,194,0,0,116,194,0,0,120,194,0,0,144,194,0,0,140,194,0,0,144,194,0,0,150,194,0,0,156,194,0,0,160,194,0,0,162,194,0,0,160,194,0,0,166,194,0,0,166,194,0,0,176,194,0,0,186,194,0,0,200,194,0,0,214,194,0,0,230,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,200,194,0,0,190,194,0,0,180,194,0,0,170,194,0,0,160,194,0,0,150,194,0,0,140,194,0,0,132,194,0,0,120,194,0,0,96,194,0,0,64,194,0,0,48,194,0,0,64,194,0,0,56,194,0,0,56,194,0,0,44,194,0,0,56,194,0,0,64,194,0,0,64,194,0,0,76,194,0,0,104,194,0,0,104,194,0,0,108,194,0,0,112,194,0,0,120,194,0,0,120,194,0,0,116,194,0,0,116,194,0,0,130,194,0,0,128,194,0,0,130,194,0,0,136,194,0,0,140,194,0,0,148,194,0,0,150,194,0,0,156,194,0,0,162,194,0,0,172,194,0,0,190,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,200,194,0,0,190,194,0,0,180,194,0,0,170,194,0,0,160,194,0,0,150,194,0,0,140,194,0,0,130,194,0,0,116,194,0,0,92,194,0,0,68,194,0,0,28,194,0,0,4,194,0,0,32,194,0,0,12,194,0,0,0,194,0,0,24,194,0,0,32,194,0,0,4,194,0,0,12,194,0,0,20,194,0,0,56,194,0,0,36,194,0,0,52,194,0,0,48,194,0,0,56,194,0,0,40,194,0,0,52,194,0,0,56,194,0,0,80,194,0,0,72,194,0,0,72,194,0,0,72,194,0,0,88,194,0,0,88,194,0,0,92,194,0,0,100,194,0,0,120,194,0,0,128,194,0,0,132,194,0,0,136,194,0,0,140,194,0,0,152,194,0,0,162,194,0,0,180,194,0,0,200,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,196,194,0,0,180,194,0,0,170,194,0,0,164,194,0,0,166,194,0,0,160,194,0,0,156,194,0,0,168,194,0,0,158,194,0,0,160,194,0,0,166,194,0,0,174,194,0,0,178,194,0,0,182,194,0,0,186,194,0,0,198,194,0,0,212,194,0,0,234,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,196,194,0,0,180,194,0,0,170,194,0,0,160,194,0,0,150,194,0,0,140,194,0,0,136,194,0,0,148,194,0,0,144,194,0,0,148,194,0,0,154,194,0,0,160,194,0,0,164,194,0,0,170,194,0,0,174,194,0,0,184,194,0,0,178,194,0,0,182,194,0,0,190,194,0,0,200,194,0,0,212,194,0,0,224,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,196,194,0,0,180,194,0,0,166,194,0,0,150,194,0,0,142,194,0,0,124,194,0,0,128,194,0,0,134,194,0,0,120,194,0,0,128,194,0,0,134,194,0,0,140,194,0,0,146,194,0,0,154,194,0,0,162,194,0,0,168,194,0,0,166,194,0,0,170,194,0,0,178,194,0,0,180,194,0,0,186,194,0,0,196,194,0,0,208,194,0,0,218,194,0,0,228,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,206,194,0,0,192,194,0,0,176,194,0,0,162,194,0,0,150,194,0,0,136,194,0,0,104,194,0,0,88,194,0,0,96,194,0,0,88,194,0,0,96,194,0,0,96,194,0,0,104,194,0,0,112,194,0,0,124,194,0,0,132,194,0,0,148,194,0,0,138,194,0,0,144,194,0,0,144,194,0,0,150,194,0,0,148,194,0,0,154,194,0,0,162,194,0,0,162,194,0,0,164,194,0,0,168,194,0,0,174,194,0,0,186,194,0,0,192,194,0,0,198,194,0,0,208,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,216,194,0,0,204,194,0,0,192,194,0,0,182,194,0,0,170,194,0,0,160,194,0,0,148,194,0,0,136,194,0,0,112,194,0,0,76,194,0,0,56,194,0,0,64,194,0,0,56,194,0,0,44,194,0,0,52,194,0,0,60,194,0,0,60,194,0,0,68,194,0,0,64,194,0,0,96,194,0,0,84,194,0,0,92,194,0,0,104,194,0,0,100,194,0,0,124,194,0,0,104,194,0,0,112,194,0,0,132,194,0,0,128,194,0,0,134,194,0,0,140,194,0,0,140,194,0,0,148,194,0,0,154,194,0,0,168,194,0,0,172,194,0,0,178,194,0,0,182,194,0,0,186,194,0,0,188,194,0,0,202,194,0,0,218,194,0,0,236,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,216,194,0,0,206,194,0,0,196,194,0,0,186,194,0,0,176,194,0,0,166,194,0,0,156,194,0,0,146,194,0,0,136,194,0,0,112,194,0,0,84,194,0,0,48,194,0,0,12,194,0,0,24,194,0,0,24,194,0,0,8,194,0,0,8,194,0,0,16,194,0,0,32,194,0,0,36,194,0,0,48,194,0,0,76,194,0,0,52,194,0,0,56,194,0,0,60,194,0,0,56,194,0,0,88,194,0,0,72,194,0,0,68,194,0,0,72,194,0,0,72,194,0,0,72,194,0,0,76,194,0,0,88,194,0,0,100,194,0,0,104,194,0,0,112,194,0,0,132,194,0,0,132,194,0,0,132,194,0,0,128,194,0,0,130,194,0,0,136,194,0,0,154,194,0,0,164,194,0,0,174,194,0,0,190,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,214,194,0,0,204,194,0,0,194,194,0,0,184,194,0,0,174,194,0,0,166,194,0,0,156,194,0,0,150,194,0,0,164,194,0,0,158,194,0,0,166,194,0,0,170,194,0,0,178,194,0,0,184,194,0,0,190,194,0,0,196,194,0,0,202,194,0,0,210,194,0,0,218,194,0,0,226,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,212,194,0,0,200,194,0,0,190,194,0,0,180,194,0,0,172,194,0,0,162,194,0,0,156,194,0,0,148,194,0,0,138,194,0,0,148,194,0,0,148,194,0,0,152,194,0,0,158,194,0,0,166,194,0,0,168,194,0,0,172,194,0,0,178,194,0,0,184,194,0,0,194,194,0,0,186,194,0,0,200,194,0,0,206,194,0,0,214,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,212,194,0,0,200,194,0,0,190,194,0,0,180,194,0,0,174,194,0,0,166,194,0,0,160,194,0,0,150,194,0,0,138,194,0,0,112,194,0,0,132,194,0,0,132,194,0,0,136,194,0,0,140,194,0,0,148,194,0,0,156,194,0,0,158,194,0,0,162,194,0,0,162,194,0,0,166,194,0,0,168,194,0,0,174,194,0,0,186,194,0,0,192,194,0,0,198,194,0,0,206,194,0,0,214,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,216,194,0,0,206,194,0,0,196,194,0,0,186,194,0,0,178,194,0,0,170,194,0,0,164,194,0,0,156,194,0,0,142,194,0,0,120,194,0,0,92,194,0,0,104,194,0,0,104,194,0,0,88,194,0,0,88,194,0,0,92,194,0,0,108,194,0,0,116,194,0,0,120,194,0,0,140,194,0,0,132,194,0,0,132,194,0,0,134,194,0,0,140,194,0,0,144,194,0,0,150,194,0,0,156,194,0,0,168,194,0,0,168,194,0,0,168,194,0,0,176,194,0,0,182,194,0,0,180,194,0,0,190,194,0,0,196,194,0,0,204,194,0,0,206,194,0,0,212,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,216,194,0,0,206,194,0,0,196,194,0,0,188,194,0,0,180,194,0,0,174,194,0,0,164,194,0,0,158,194,0,0,146,194,0,0,134,194,0,0,104,194,0,0,60,194,0,0,72,194,0,0,52,194,0,0,36,194,0,0,52,194,0,0,64,194,0,0,48,194,0,0,48,194,0,0,68,194,0,0,88,194,0,0,76,194,0,0,64,194,0,0,60,194,0,0,68,194,0,0,72,194,0,0,76,194,0,0,100,194,0,0,104,194,0,0,112,194,0,0,124,194,0,0,138,194,0,0,140,194,0,0,138,194,0,0,142,194,0,0,148,194,0,0,156,194,0,0,164,194,0,0,180,194,0,0,190,194,0,0,202,194,0,0,210,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,202,194,0,0,194,194,0,0,186,194,0,0,180,194,0,0,170,194,0,0,160,194,0,0,154,194,0,0,144,194,0,0,130,194,0,0,96,194,0,0,64,194,0,0,20,194,0,0,32,194,0,0,16,194,0,0,8,194,0,0,32,194,0,0,72,194,0,0,60,194,0,0,24,194,0,0,36,194,0,0,60,194,0,0,24,194,0,0,12,194,0,0,28,194,0,0,24,194,0,0,44,194,0,0,32,194,0,0,52,194,0,0,72,194,0,0,52,194,0,0,48,194,0,0,60,194,0,0,72,194,0,0,92,194,0,0,64,194,0,0,64,194,0,0,80,194,0,0,132,194,0,0,140,194,0,0,152,194,0,0,164,194,0,0,180,194,0,0,194,194,0,0,210,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,216,194,0,0,206,194,0,0,196,194,0,0,186,194,0,0,172,194,0,0,158,194,0,0,152,194,0,0,166,194,0,0,162,194,0,0,170,194,0,0,174,194,0,0,178,194,0,0,186,194,0,0,196,194,0,0,204,194,0,0,214,194,0,0,224,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,216,194,0,0,206,194,0,0,196,194,0,0,186,194,0,0,172,194,0,0,158,194,0,0,142,194,0,0,154,194,0,0,148,194,0,0,154,194,0,0,158,194,0,0,162,194,0,0,168,194,0,0,170,194,0,0,180,194,0,0,184,194,0,0,186,194,0,0,184,194,0,0,196,194,0,0,202,194,0,0,216,194,0,0,224,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,216,194,0,0,206,194,0,0,196,194,0,0,186,194,0,0,174,194,0,0,156,194,0,0,136,194,0,0,130,194,0,0,132,194,0,0,120,194,0,0,130,194,0,0,134,194,0,0,140,194,0,0,146,194,0,0,150,194,0,0,156,194,0,0,164,194,0,0,164,194,0,0,166,194,0,0,168,194,0,0,182,194,0,0,186,194,0,0,196,194,0,0,204,194,0,0,212,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,200,194,0,0,190,194,0,0,180,194,0,0,164,194,0,0,148,194,0,0,120,194,0,0,100,194,0,0,104,194,0,0,96,194,0,0,76,194,0,0,80,194,0,0,80,194,0,0,88,194,0,0,88,194,0,0,104,194,0,0,132,194,0,0,108,194,0,0,112,194,0,0,124,194,0,0,132,194,0,0,138,194,0,0,146,194,0,0,158,194,0,0,166,194,0,0,168,194,0,0,160,194,0,0,162,194,0,0,162,194,0,0,164,194,0,0,176,194,0,0,184,194,0,0,196,194,0,0,210,194,0,0,226,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,214,194,0,0,204,194,0,0,194,194,0,0,184,194,0,0,168,194,0,0,158,194,0,0,138,194,0,0,100,194,0,0,60,194,0,0,80,194,0,0,60,194,0,0,48,194,0,0,52,194,0,0,72,194,0,0,80,194,0,0,40,194,0,0,40,194,0,0,84,194,0,0,44,194,0,0,44,194,0,0,64,194,0,0,76,194,0,0,96,194,0,0,92,194,0,0,80,194,0,0,100,194,0,0,108,194,0,0,116,194,0,0,120,194,0,0,134,194,0,0,142,194,0,0,156,194,0,0,166,194,0,0,172,194,0,0,188,194,0,0,196,194,0,0,206,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,200,194,0,0,190,194,0,0,180,194,0,0,168,194,0,0,156,194,0,0,140,194,0,0,116,194,0,0,76,194,0,0,36,194,0,0,32,194,0,0,24,194,0,0,32,194,0,0,56,194,0,0,80,194,0,0,76,194,0,0,36,194,0,0,32,194,0,0,56,194,0,0,32,194,0,0,24,194,0,0,24,194,0,0,36,194,0,0,56,194,0,0,36,194,0,0,56,194,0,0,60,194,0,0,44,194,0,0,44,194,0,0,52,194,0,0,36,194,0,0,52,194,0,0,96,194,0,0,134,194,0,0,136,194,0,0,166,194,0,0,174,194,0,0,180,194,0,0,190,194,0,0,204,194,0,0,214,194,0,0,226,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,218,194,0,0,210,194,0,0,202,194,0,0,192,194,0,0,182,194,0,0,168,194,0,0,154,194,0,0,164,194,0,0,164,194,0,0,170,194,0,0,178,194,0,0,188,194,0,0,200,194,0,0,212,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,212,194,0,0,206,194,0,0,196,194,0,0,184,194,0,0,170,194,0,0,160,194,0,0,142,194,0,0,150,194,0,0,144,194,0,0,152,194,0,0,160,194,0,0,168,194,0,0,172,194,0,0,178,194,0,0,186,194,0,0,200,194,0,0,214,194,0,0,226,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,214,194,0,0,208,194,0,0,202,194,0,0,194,194,0,0,184,194,0,0,176,194,0,0,168,194,0,0,160,194,0,0,128,194,0,0,132,194,0,0,124,194,0,0,128,194,0,0,132,194,0,0,138,194,0,0,146,194,0,0,154,194,0,0,166,194,0,0,166,194,0,0,172,194,0,0,182,194,0,0,196,194,0,0,208,194,0,0,222,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,214,194,0,0,208,194,0,0,202,194,0,0,194,194,0,0,184,194,0,0,180,194,0,0,168,194,0,0,148,194,0,0,100,194,0,0,104,194,0,0,80,194,0,0,92,194,0,0,88,194,0,0,72,194,0,0,80,194,0,0,72,194,0,0,80,194,0,0,124,194,0,0,120,194,0,0,138,194,0,0,152,194,0,0,154,194,0,0,156,194,0,0,156,194,0,0,158,194,0,0,164,194,0,0,176,194,0,0,188,194,0,0,200,194,0,0,212,194,0,0,222,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,212,194,0,0,204,194,0,0,196,194,0,0,190,194,0,0,180,194,0,0,170,194,0,0,166,194,0,0,156,194,0,0,140,194,0,0,72,194,0,0,72,194,0,0,36,194,0,0,48,194,0,0,68,194,0,0,60,194,0,0,72,194,0,0,72,194,0,0,48,194,0,0,92,194,0,0,56,194,0,0,60,194,0,0,64,194,0,0,64,194,0,0,88,194,0,0,68,194,0,0,68,194,0,0,104,194,0,0,120,194,0,0,142,194,0,0,162,194,0,0,174,194,0,0,184,194,0,0,194,194,0,0,204,194,0,0,216,194,0,0,228,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,212,194,0,0,204,194,0,0,196,194,0,0,190,194,0,0,180,194,0,0,170,194,0,0,166,194,0,0,156,194,0,0,140,194,0,0,52,194,0,0,44,194,0,0,36,194,0,0,60,194,0,0,72,194,0,0,76,194,0,0,72,194,0,0,68,194,0,0,52,194,0,0,60,194,0,0,36,194,0,0,48,194,0,0,36,194,0,0,28,194,0,0,44,194,0,0,24,194,0,0,20,194,0,0,32,194,0,0,36,194,0,0,48,194,0,0,72,194,0,0,104,194,0,0,130,194,0,0,146,194,0,0,158,194,0,0,170,194,0,0,184,194,0,0,194,194,0,0,202,194,0,0,210,194,0,0,218,194,0,0,226,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,214,194,0,0,200,194,0,0,190,194,0,0,174,194,0,0,162,194,0,0,170,194,0,0,166,194,0,0,176,194,0,0,186,194,0,0,200,194,0,0,214,194,0,0,228,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,214,194,0,0,202,194,0,0,190,194,0,0,176,194,0,0,166,194,0,0,152,194,0,0,146,194,0,0,144,194,0,0,158,194,0,0,168,194,0,0,180,194,0,0,190,194,0,0,200,194,0,0,210,194,0,0,220,194,0,0,230,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,208,194,0,0,196,194,0,0,184,194,0,0,174,194,0,0,162,194,0,0,140,194,0,0,130,194,0,0,120,194,0,0,134,194,0,0,142,194,0,0,148,194,0,0,160,194,0,0,170,194,0,0,182,194,0,0,190,194,0,0,198,194,0,0,206,194,0,0,216,194,0,0,222,194,0,0,228,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,206,194,0,0,194,194,0,0,180,194,0,0,170,194,0,0,152,194,0,0,112,194,0,0,96,194,0,0,88,194,0,0,112,194,0,0,120,194,0,0,116,194,0,0,96,194,0,0,124,194,0,0,130,194,0,0,146,194,0,0,148,194,0,0,154,194,0,0,150,194,0,0,156,194,0,0,162,194,0,0,172,194,0,0,174,194,0,0,176,194,0,0,182,194,0,0,188,194,0,0,196,194,0,0,206,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,200,194,0,0,194,194,0,0,184,194,0,0,172,194,0,0,162,194,0,0,158,194,0,0,140,194,0,0,100,194,0,0,76,194,0,0,60,194,0,0,76,194,0,0,104,194,0,0,112,194,0,0,96,194,0,0,84,194,0,0,72,194,0,0,104,194,0,0,80,194,0,0,72,194,0,0,72,194,0,0,84,194,0,0,92,194,0,0,128,194,0,0,138,194,0,0,142,194,0,0,170,194,0,0,164,194,0,0,156,194,0,0,162,194,0,0,170,194,0,0,190,194,0,0,204,194,0,0,224,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,200,194,0,0,194,194,0,0,184,194,0,0,170,194,0,0,166,194,0,0,158,194,0,0,144,194,0,0,68,194,0,0,32,194,0,0,44,194,0,0,44,194,0,0,88,194,0,0,96,194,0,0,76,194,0,0,72,194,0,0,32,194,0,0,44,194,0,0,24,194,0,0,16,194,0,0,12,194,0,0,20,194,0,0,24,194,0,0,20,194,0,0,48,194,0,0,88,194,0,0,112,194,0,0,100,194,0,0,112,194,0,0,140,194,0,0,150,194,0,0,168,194,0,0,184,194,0,0,206,194,0,0,224,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,204,194,0,0,190,194,0,0,178,194,0,0,164,194,0,0,166,194,0,0,168,194,0,0,180,194,0,0,184,194,0,0,198,194,0,0,214,194,0,0,226,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,214,194,0,0,202,194,0,0,190,194,0,0,178,194,0,0,166,194,0,0,144,194,0,0,148,194,0,0,156,194,0,0,170,194,0,0,176,194,0,0,176,194,0,0,180,194,0,0,184,194,0,0,196,194,0,0,210,194,0,0,222,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,218,194,0,0,206,194,0,0,194,194,0,0,186,194,0,0,174,194,0,0,162,194,0,0,140,194,0,0,140,194,0,0,134,194,0,0,150,194,0,0,146,194,0,0,152,194,0,0,158,194,0,0,162,194,0,0,166,194,0,0,176,194,0,0,178,194,0,0,194,194,0,0,206,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,214,194,0,0,200,194,0,0,188,194,0,0,176,194,0,0,166,194,0,0,150,194,0,0,124,194,0,0,108,194,0,0,108,194,0,0,124,194,0,0,132,194,0,0,112,194,0,0,120,194,0,0,134,194,0,0,134,194,0,0,154,194,0,0,152,194,0,0,162,194,0,0,176,194,0,0,172,194,0,0,184,194,0,0,192,194,0,0,204,194,0,0,218,194,0,0,232,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,196,194,0,0,184,194,0,0,172,194,0,0,162,194,0,0,146,194,0,0,96,194,0,0,80,194,0,0,60,194,0,0,92,194,0,0,112,194,0,0,104,194,0,0,80,194,0,0,76,194,0,0,52,194,0,0,68,194,0,0,72,194,0,0,84,194,0,0,88,194,0,0,116,194,0,0,142,194,0,0,140,194,0,0,138,194,0,0,156,194,0,0,158,194,0,0,174,194,0,0,180,194,0,0,192,194,0,0,208,194,0,0,224,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,206,194,0,0,192,194,0,0,180,194,0,0,172,194,0,0,156,194,0,0,140,194,0,0,76,194,0,0,40,194,0,0,60,194,0,0,64,194,0,0,92,194,0,0,88,194,0,0,88,194,0,0,84,194,0,0,40,194,0,0,12,194,0,0,224,193,0,0,4,194,0,0,24,194,0,0,20,194,0,0,48,194,0,0,60,194,0,0,68,194,0,0,88,194,0,0,124,194,0,0,136,194,0,0,156,194,0,0,164,194,0,0,178,194,0,0,188,194,0,0,198,194,0,0,208,194,0,0,218,194,0,0,228,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,200,194,0,0,180,194,0,0,158,194,0,0,170,194,0,0,162,194,0,0,164,194,0,0,164,194,0,0,178,194,0,0,188,194,0,0,198,194,0,0,206,194,0,0,218,194,0,0,230,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,194,194,0,0,170,194,0,0,144,194,0,0,148,194,0,0,140,194,0,0,140,194,0,0,140,194,0,0,152,194,0,0,170,194,0,0,182,194,0,0,186,194,0,0,194,194,0,0,206,194,0,0,218,194,0,0,230,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,224,194,0,0,186,194], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+10240);
/* memory initializer */ allocate([0,0,162,194,0,0,136,194,0,0,120,194,0,0,112,194,0,0,112,194,0,0,100,194,0,0,124,194,0,0,140,194,0,0,154,194,0,0,164,194,0,0,180,194,0,0,186,194,0,0,196,194,0,0,208,194,0,0,218,194,0,0,226,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,226,194,0,0,200,194,0,0,186,194,0,0,168,194,0,0,124,194,0,0,104,194,0,0,64,194,0,0,84,194,0,0,88,194,0,0,80,194,0,0,80,194,0,0,100,194,0,0,128,194,0,0,132,194,0,0,152,194,0,0,166,194,0,0,162,194,0,0,170,194,0,0,170,194,0,0,180,194,0,0,190,194,0,0,196,194,0,0,202,194,0,0,206,194,0,0,212,194,0,0,216,194,0,0,222,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,210,194,0,0,190,194,0,0,172,194,0,0,148,194,0,0,84,194,0,0,72,194,0,0,24,194,0,0,44,194,0,0,68,194,0,0,44,194,0,0,40,194,0,0,28,194,0,0,28,194,0,0,56,194,0,0,80,194,0,0,100,194,0,0,96,194,0,0,144,194,0,0,138,194,0,0,148,194,0,0,162,194,0,0,174,194,0,0,184,194,0,0,188,194,0,0,194,194,0,0,198,194,0,0,204,194,0,0,210,194,0,0,216,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,216,194,0,0,198,194,0,0,180,194,0,0,152,194,0,0,132,194,0,0,52,194,0,0,44,194,0,0,36,194,0,0,48,194,0,0,60,194,0,0,44,194,0,0,60,194,0,0,32,194,0,0,240,193,0,0,248,193,0,0,248,193,0,0,28,194,0,0,4,194,0,0,32,194,0,0,36,194,0,0,44,194,0,0,84,194,0,0,108,194,0,0,140,194,0,0,146,194,0,0,154,194,0,0,158,194,0,0,164,194,0,0,168,194,0,0,174,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,182,194,0,0,152,194,0,0,150,194,0,0,170,194,0,0,186,194,0,0,196,194,0,0,208,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,182,194,0,0,140,194,0,0,140,194,0,0,150,194,0,0,172,194,0,0,178,194,0,0,188,194,0,0,196,194,0,0,202,194,0,0,212,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,190,194,0,0,160,194,0,0,112,194,0,0,130,194,0,0,128,194,0,0,148,194,0,0,166,194,0,0,176,194,0,0,182,194,0,0,190,194,0,0,198,194,0,0,206,194,0,0,214,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,190,194,0,0,160,194,0,0,104,194,0,0,92,194,0,0,68,194,0,0,132,194,0,0,136,194,0,0,142,194,0,0,156,194,0,0,156,194,0,0,160,194,0,0,176,194,0,0,170,194,0,0,178,194,0,0,194,194,0,0,200,194,0,0,210,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,190,194,0,0,160,194,0,0,84,194,0,0,80,194,0,0,36,194,0,0,108,194,0,0,108,194,0,0,68,194,0,0,104,194,0,0,96,194,0,0,124,194,0,0,172,194,0,0,158,194,0,0,180,194,0,0,186,194,0,0,196,194,0,0,206,194,0,0,214,194,0,0,224,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,194,194,0,0,182,194,0,0,146,194,0,0,52,194,0,0,32,194,0,0,4,194,0,0,84,194,0,0,116,194,0,0,68,194,0,0,88,194,0,0,72,194,0,0,72,194,0,0,112,194,0,0,80,194,0,0,134,194,0,0,148,194,0,0,162,194,0,0,184,194,0,0,192,194,0,0,200,194,0,0,210,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,226,194,0,0,212,194,0,0,198,194,0,0,184,194,0,0,154,194,0,0,160,194,0,0,176,194,0,0,194,194,0,0,212,194,0,0,230,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,232,194,0,0,218,194,0,0,204,194,0,0,190,194,0,0,178,194,0,0,148,194,0,0,144,194,0,0,176,194,0,0,174,194,0,0,190,194,0,0,204,194,0,0,218,194,0,0,232,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,232,194,0,0,218,194,0,0,204,194,0,0,190,194,0,0,178,194,0,0,150,194,0,0,132,194,0,0,148,194,0,0,154,194,0,0,156,194,0,0,172,194,0,0,174,194,0,0,180,194,0,0,192,194,0,0,210,194,0,0,230,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,230,194,0,0,216,194,0,0,202,194,0,0,188,194,0,0,176,194,0,0,132,194,0,0,96,194,0,0,116,194,0,0,140,194,0,0,130,194,0,0,156,194,0,0,144,194,0,0,166,194,0,0,168,194,0,0,186,194,0,0,196,194,0,0,210,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,210,194,0,0,190,194,0,0,178,194,0,0,164,194,0,0,100,194,0,0,80,194,0,0,80,194,0,0,108,194,0,0,96,194,0,0,108,194,0,0,104,194,0,0,138,194,0,0,134,194,0,0,176,194,0,0,164,194,0,0,164,194,0,0,178,194,0,0,188,194,0,0,200,194,0,0,216,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,202,194,0,0,192,194,0,0,180,194,0,0,166,194,0,0,154,194,0,0,88,194,0,0,44,194,0,0,24,194,0,0,72,194,0,0,64,194,0,0,80,194,0,0,64,194,0,0,40,194,0,0,40,194,0,0,76,194,0,0,80,194,0,0,84,194,0,0,108,194,0,0,130,194,0,0,142,194,0,0,156,194,0,0,170,194,0,0,190,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,240,194,0,0,210,194,0,0,172,194,0,0,136,194,0,0,156,194,0,0,158,194,0,0,180,194,0,0,200,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,240,194,0,0,210,194,0,0,172,194,0,0,132,194,0,0,146,194,0,0,154,194,0,0,176,194,0,0,192,194,0,0,210,194,0,0,230,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,240,194,0,0,210,194,0,0,184,194,0,0,160,194,0,0,116,194,0,0,128,194,0,0,136,194,0,0,160,194,0,0,174,194,0,0,184,194,0,0,200,194,0,0,220,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,240,194,0,0,208,194,0,0,182,194,0,0,158,194,0,0,80,194,0,0,112,194,0,0,88,194,0,0,128,194,0,0,138,194,0,0,154,194,0,0,160,194,0,0,164,194,0,0,168,194,0,0,170,194,0,0,174,194,0,0,176,194,0,0,180,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,236,194,0,0,200,194,0,0,174,194,0,0,154,194,0,0,68,194,0,0,72,194,0,0,48,194,0,0,104,194,0,0,116,194,0,0,116,194,0,0,134,194,0,0,130,194,0,0,120,194,0,0,120,194,0,0,120,194,0,0,130,194,0,0,136,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,230,194,0,0,196,194,0,0,168,194,0,0,120,194,0,0,68,194,0,0,48,194,0,0,24,194,0,0,56,194,0,0,68,194,0,0,68,194,0,0,56,194,0,0,28,194,0,0,20,194,0,0,28,194,0,0,32,194,0,0,40,194,0,0,44,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,176,194,0,0,148,194,0,0,154,194,0,0,164,194,0,0,164,194,0,0,170,194,0,0,180,194,0,0,188,194,0,0,198,194,0,0,208,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,176,194,0,0,132,194,0,0,140,194,0,0,162,194,0,0,160,194,0,0,162,194,0,0,168,194,0,0,176,194,0,0,182,194,0,0,186,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,176,194,0,0,116,194,0,0,124,194,0,0,140,194,0,0,142,194,0,0,148,194,0,0,154,194,0,0,160,194,0,0,166,194,0,0,170,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,172,194,0,0,120,194,0,0,124,194,0,0,120,194,0,0,120,194,0,0,104,194,0,0,80,194,0,0,72,194,0,0,72,194,0,0,80,194,0,0,88,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,236,194,0,0,216,194,0,0,168,194,0,0,84,194,0,0,72,194,0,0,72,194,0,0,72,194,0,0,92,194,0,0,60,194,0,0,52,194,0,0,32,194,0,0,32,194,0,0,32,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,236,194,0,0,200,194,0,0,146,194,0,0,44,194,0,0,20,194,0,0,40,194,0,0,44,194,0,0,84,194,0,0,24,194,0,0,20,194,0,0,12,194,0,0,12,194,0,0,24,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,200,194,0,0,182,194,0,0,168,194,0,0,148,194,0,0,160,194,0,0,160,194,0,0,160,194,0,0,160,194,0,0,160,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,200,194,0,0,182,194,0,0,168,194,0,0,148,194,0,0,136,194,0,0,136,194,0,0,136,194,0,0,136,194,0,0,136,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,200,194,0,0,172,194,0,0,156,194,0,0,140,194,0,0,112,194,0,0,52,194,0,0,240,193,0,0,168,193,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,200,194,0,0,174,194,0,0,156,194,0,0,134,194,0,0,64,194,0,0,24,194,0,0,232,193,0,0,168,193,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,200,194,0,0,172,194,0,0,138,194,0,0,96,194,0,0,52,194,0,0,12,194,0,0,4,194,0,0,232,193,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,0,220,194,0,0,200,194,0,0,166,194,0,0,142,194,0,0,64,194,0,0,216,193,0,0,24,194,0,0,20,194,0,0,8,194,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,0,192,121,196,192,237,0,0,224,237,0,0,176,109,0,0,208,109,0,0,240,109,0,0,0,0,0,0,0,242,0,0,0,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,2,0,0,0,1,0,0,0,3,0,0,0,1,0,0,0,1,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,4,0,0,0,2,0,0,0,5,0,0,0,4,0,0,0,2,0,0,0,3,0,0,0,5,0,0,0,64,110,0,0,192,110,0,0,192,111,0,0,192,113,0,0,192,117,0,0,192,125,0,0,192,141,0,0,192,173,0,0,24,0,120,58,76,70,11,60,242,204,192,60,116,252,59,61,86,73,154,61,241,93,228,61,248,163,29,62,180,231,78,62,54,157,130,62,78,220,159,62,193,174,190,62,65,132,222,62,173,194,254,62,186,101,15,63,248,0,31,63,29,233,45,63,249,219,59,63,45,162,72,63,160,17,84,63,38,15,94,63,46,143,102,63,112,149,109,63,174,51,115,63,159,135,119,63,66,184,122,63,196,242,124,63,75,103,126,63,196,69,127,63,241,186,127,63,217,237,127,63,162,253,127,63,248,255,127,63,168,9,120,57,17,119,11,59,135,139,193,59,74,113,61,60,148,82,156,60,94,8,233,60,42,83,34,61,74,118,87,61,138,227,137,61,7,140,171,61,34,154,208,61,108,239,248,61,164,52,18,62,100,112,41,62,65,21,66,62,67,11,92,62,47,56,119,62,197,191,137,62,92,97,152,62,135,112,167,62,4,220,182,62,188,145,198,62,231,126,214,62,48,144,230,62,227,177,246,62,13,104,3,63,121,107,11,63,98,89,19,63,42,40,27,63,137,206,34,63,166,67,42,63,49,127,49,63,126,121,56,63,153,43,63,63,92,143,69,63,127,159,75,63,165,87,81,63,104,180,86,63,89,179,91,63,8,83,96,63,252,146,100,63,177,115,104,63,138,246,107,63,198,29,111,63,109,236,113,63,62,102,116,63,154,143,118,63,104,109,120,63,3,5,122,63,26,92,123,63,153,120,124,63,143,96,125,63,17,26,126,63,39,171,126,63,176,25,127,63,74,107,127,63,68,165,127,63,132,204,127,63,123,229,127,63,17,244,127,63,158,251,127,63,219,254,127,63,218,255,127,63,0,0,128,63,5,12,120,56,50,131,11,58,118,186,193,58,226,203,61,59,38,207,156,59,139,32,234,59,245,102,35,60,63,100,89,60,184,127,139,60,59,23,174,60,239,114,212,60,96,140,254,60,45,46,22,61,114,237,46,61,155,127,73,61,220,223,101,61,123,4,130,61,159,250,145,61,71,207,162,61,38,127,180,61,173,6,199,61,16,98,218,61,63,141,238,61,244,193,1,62,185,160,12,62,128,224,23,62,182,126,35,62,166,120,47,62,116,203,59,62,34,116,72,62,141,111,85,62,107,186,98,62,83,81,112,62,180,48,126,62,110,42,134,62,252,92,141,62,9,174,148,62,138,27,156,62,100,163,163,62,112,67,171,62,119,249,178,62,54,195,186,62,93,158,194,62,147,136,202,62,118,127,210,62,154,128,218,62,142,137,226,62,217,151,234,62,2,169,242,62,139,186,250,62,251,100,1,63,99,106,5,63,65,108,9,63,89,105,13,63,116,96,17,63,94,80,21,63,231,55,25,63,231,21,29,63,58,233,32,63,197,176,36,63,116,107,40,63,62,24,44,63,35,182,47,63,43,68,51,63,109,193,54,63,10,45,58,63,48,134,61,63,26,204,64,63,17,254,67,63,107,27,71,63,142,35,74,63,238,21,77,63,15,242,79,63,132,183,82,63,239,101,85,63,3,253,87,63,129,124,90,63,60,228,92,63,21,52,95,63,254,107,97,63,246,139,99,63,14,148,101,63,98,132,103,63,33,93,105,63,133,30,107,63,213,200,108,63,103,92,110,63,155,217,111,63,224,64,113,63,172,146,114,63,131,207,115,63,241,247,116,63,139,12,118,63,239,13,119,63,193,252,119,63,172,217,120,63,99,165,121,63,155,96,122,63,15,12,123,63,124,168,123,63,163,54,124,63,71,183,124,63,41,43,125,63,13,147,125,63,183,239,125,63,229,65,126,63,89,138,126,63,205,201,126,63,251,0,127,63,150,48,127,63,78,89,127,63,205,123,127,63,182,152,127,63,167,176,127,63,53,196,127,63,239,211,127,63,91,224,127,63,245,233,127,63,51,241,127,63,127,246,127,63,59,250,127,63,190,252,127,63,84,254,127,63,64,255,127,63,186,255,127,63,238,255,127,63,254,255,127,63,0,0,128,63,169,12,120,55,54,134,11,57,38,198,193,57,94,226,61,58,234,237,156,58,85,101,234,58,56,170,35,59,207,219,89,59,169,226,139,59,42,178,174,59,13,91,213,59,204,219,255,59,91,25,23,60,250,46,48,60,194,45,75,60,156,20,104,60,46,113,131,60,225,202,147,60,185,22,165,60,1,84,183,60,245,129,202,60,198,159,222,60,155,172,243,60,199,211,4,61,213,71,16,61,250,49,28,61,174,145,40,61,101,102,53,61,141,175,66,61,140,108,80,61,193,156,94,61,133,63,109,61,41,84,124,61,252,236,133,61,26,232,141,61,13,27,150,61,110,133,158,61,212,38,167,61,210,254,175,61,245,12,185,61,200,80,194,61,209,201,203,61,146,119,213,61,139,89,223,61,51,111,233,61,2,184,243,61,105,51,254,61,106,112,4,62,214,223,9,62,171,103,15,62,153,7,21,62,77,191,26,62,116,142,32,62,181,116,38,62,184,113,44,62,34,133,50,62,149,174,56,62,178,237,62,62,21,66,69,62,92,171,75,62,30,41,82,62,243,186,88,62,112,96,95,62,40,25,102,62,170,228,108,62,132,194,115,62,68,178,122,62,185,217,128,62,203,98,132,62,26,244,135,62,105,141,139,62,120,46,143,62,6,215,146,62,211,134,150,62,156,61,154,62,29,251,157,62,19,191,161,62,57,137,165,62,71,89,169,62,249,46,173,62,5,10,177,62,36,234,180,62,13,207,184,62,117,184,188,62,18,166,192,62,153,151,196,62,190,140,200,62,52,133,204,62,175,128,208,62,225,126,212,62,125,127,216,62,52,130,220,62,184,134,224,62,185,140,228,62,233,147,232,62,248,155,236,62,150,164,240,62,117,173,244,62,67,182,248,62,178,190,252,62,57,99,0,63,153,102,2,63,82,105,4,63,60,107,6,63,48,108,8,63,6,108,10,63,151,106,12,63,188,103,14,63,78,99,16,63,39,93,18,63,33,85,20,63,21,75,22,63,222,62,24,63,87,48,26,63,92,31,28,63,199,11,30,63,117,245,31,63,66,220,33,63,12,192,35,63,176,160,37,63,12,126,39,63,254,87,41,63,104,46,43,63,39,1,45,63,29,208,46,63,43,155,48,63,51,98,50,63,23,37,52,63,188,227,53,63,4,158,55,63,214,83,57,63,23,5,59,63,173,177,60,63,128,89,62,63,120,252,63,63,126,154,65,63,124,51,67,63,93,199,68,63,12,86,70,63,119,223,71,63,138,99,73,63,54,226,74,63,104,91,76,63,17,207,77,63,35,61,79,63,145,165,80,63,76,8,82,63,75,101,83,63,130,188,84,63,231,13,86,63,114,89,87,63,26,159,88,63,218,222,89,63,172,24,91,63,138,76,92,63,113,122,93,63,93,162,94,63,78,196,95,63,67,224,96,63,58,246,97,63,54,6,99,63,56,16,100,63,67,20,101,63,92,18,102,63,133,10,103,63,198,252,103,63,37,233,104,63,168,207,105,63,89,176,106,63,64,139,107,63,102,96,108,63,216,47,109,63,159,249,109,63,201,189,110,63,97,124,111,63,118,53,112,63,23,233,112,63,81,151,113,63,53,64,114,63,212,227,114,63,61,130,115,63,131,27,116,63,184,175,116,63,238,62,117,63,56,201,117,63,171,78,118,63,90,207,118,63,90,75,119,63,192,194,119,63,162,53,120,63,21,164,120,63,48,14,121,63,8,116,121,63,182,213,121,63,79,51,122,63,235,140,122,63,162,226,122,63,139,52,123,63,191,130,123,63,85,205,123,63,102,20,124,63,9,88,124,63,88,152,124,63,106,213,124,63,88,15,125,63,58,70,125,63,41,122,125,63,62,171,125,63,143,217,125,63,54,5,126,63,75,46,126,63,228,84,126,63,27,121,126,63,7,155,126,63,190,186,126,63,88,216,126,63,236,243,126,63,144,13,127,63,91,37,127,63,99,59,127,63,188,79,127,63,125,98,127,63,185,115,127,63,135,131,127,63,249,145,127,63,36,159,127,63,26,171,127,63,238,181,127,63,179,191,127,63,122,200,127,63,85,208,127,63,84,215,127,63,136,221,127,63,0,227,127,63,204,231,127,63,249,235,127,63,150,239,127,63,177,242,127,63,85,245,127,63,144,247,127,63,109,249,127,63,246,250,127,63,54,252,127,63,55,253,127,63,1,254,127,63,156,254,127,63,18,255,127,63,103,255,127,63,163,255,127,63,204,255,127,63,229,255,127,63,244,255,127,63,252,255,127,63,255,255,127,63,0,0,128,63,0,0,128,63,60,12,120,54,253,134,11,56,19,201,193,56,248,231,61,57,148,245,156,57,115,118,234,57,238,186,35,58,113,249,89,58,32,251,139,58,96,216,174,58,34,148,213,58,3,23,0,59,209,82,23,59,65,125,48,59,21,150,75,59,8,157,104,59,233,200,131,59,20,58,148,59,218,161,165,59,16,0,184,59,136,84,203,59,16,159,223,59,118,223,244,59,194,138,5,60,128,32,17,60,217,48,29,60,172,187,41,60,219,192,54,60,67,64,68,60,194,57,82,60,52,173,96,60,115,154,111,60,88,1,127,60,222,112,135,60,186,157,143,60,42,7,152,60,25,173,160,60,112,143,169,60,23,174,178,60,246,8,188,60,243,159,197,60,245,114,207,60,225,129,217,60,156,204,227,60,10,83,238,60,14,21,249,60,70,9,2,61,177,165,7,61,187,95,13,61,81,55,19,61,102,44,25,61,230,62,31,61,195,110,37,61,233,187,43,61,71,38,50,61,202,173,56,61,97,82,63,61,247,19,70,61,121,242,76,61,210,237,83,61,240,5,91,61,187,58,98,61,32,140,105,61,8,250,112,61,93,132,120,61,132,21,128,61,249,246,131,61,130,230,135,61,19,228,139,61,159,239,143,61,26,9,148,61,119,48,152,61,169,101,156,61,163,168,160,61,88,249,164,61,186,87,169,61,186,195,173,61,76,61,178,61,95,196,182,61,230,88,187,61,209,250,191,61,18,170,196,61,152,102,201,61,85,48,206,61,56,7,211,61,48,235,215,61,47,220,220,61,34,218,225,61,248,228,230,61,161,252,235,61,11,33,241,61,35,82,246,61,217,143,251,61,13,109,0,62,105,24,3,62,247,201,5,62,174,129,8,62,133,63,11,62,113,3,14,62,104,205,16,62,96,157,19,62,79,115,22,62,42,79,25,62,232,48,28,62,124,24,31,62,221,5,34,62,255,248,36,62,215,241,39,62,90,240,42,62,125,244,45,62,51,254,48,62,114,13,52,62,45,34,55,62,88,60,58,62,232,91,61,62,208,128,64,62,3,171,67,62,118,218,70,62,26,15,74,62,229,72,77,62,199,135,80,62,181,203,83,62,162,20,87,62,127,98,90,62,63,181,93,62,213,12,97,62,50,105,100,62,73,202,103,62,12,48,107,62,108,154,110,62,92,9,114,62,203,124,117,62,173,244,120,62,241,112,124,62,138,241,127,62,52,187,129,62,190,127,131,62,91,70,133,62,4,15,135,62,176,217,136,62,89,166,138,62,245,116,140,62,126,69,142,62,234,23,144,62,50,236,145,62,78,194,147,62], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+20480);
/* memory initializer */ allocate([54,154,149,62,224,115,151,62,70,79,153,62,93,44,155,62,31,11,157,62,130,235,158,62,127,205,160,62,11,177,162,62,31,150,164,62,177,124,166,62,186,100,168,62,47,78,170,62,9,57,172,62,62,37,174,62,198,18,176,62,150,1,178,62,167,241,179,62,238,226,181,62,100,213,183,62,254,200,185,62,179,189,187,62,122,179,189,62,74,170,191,62,25,162,193,62,221,154,195,62,142,148,197,62,34,143,199,62,142,138,201,62,203,134,203,62,205,131,205,62,140,129,207,62,253,127,209,62,24,127,211,62,210,126,213,62,33,127,215,62,252,127,217,62,88,129,219,62,45,131,221,62,112,133,223,62,23,136,225,62,25,139,227,62,108,142,229,62,5,146,231,62,219,149,233,62,228,153,235,62,21,158,237,62,102,162,239,62,203,166,241,62,59,171,243,62,173,175,245,62,21,180,247,62,107,184,249,62,164,188,251,62,181,192,253,62,150,196,255,62,30,228,0,63,207,229,1,63,88,231,2,63,182,232,3,63,226,233,4,63,215,234,5,63,146,235,6,63,12,236,7,63,66,236,8,63,45,236,9,63,202,235,10,63,19,235,11,63,4,234,12,63,151,232,13,63,200,230,14,63,145,228,15,63,239,225,16,63,220,222,17,63,84,219,18,63,81,215,19,63,208,210,20,63,202,205,21,63,61,200,22,63,34,194,23,63,117,187,24,63,50,180,25,63,85,172,26,63,215,163,27,63,182,154,28,63,236,144,29,63,117,134,30,63,77,123,31,63,110,111,32,63,214,98,33,63,126,85,34,63,100,71,35,63,130,56,36,63,212,40,37,63,87,24,38,63,5,7,39,63,219,244,39,63,213,225,40,63,239,205,41,63,36,185,42,63,113,163,43,63,209,140,44,63,64,117,45,63,188,92,46,63,63,67,47,63,199,40,48,63,78,13,49,63,211,240,49,63,80,211,50,63,195,180,51,63,39,149,52,63,122,116,53,63,184,82,54,63,220,47,55,63,229,11,56,63,206,230,56,63,149,192,57,63,54,153,58,63,174,112,59,63,249,70,60,63,21,28,61,63,255,239,61,63,179,194,62,63,48,148,63,63,113,100,64,63,116,51,65,63,55,1,66,63,182,205,66,63,239,152,67,63,224,98,68,63,134,43,69,63,222,242,69,63,230,184,70,63,156,125,71,63,253,64,72,63,7,3,73,63,184,195,73,63,14,131,74,63,6,65,75,63,159,253,75,63,215,184,76,63,172,114,77,63,28,43,78,63,38,226,78,63,199,151,79,63,253,75,80,63,201,254,80,63,39,176,81,63,22,96,82,63,150,14,83,63,164,187,83,63,63,103,84,63,103,17,85,63,26,186,85,63,86,97,86,63,28,7,87,63,105,171,87,63,62,78,88,63,152,239,88,63,120,143,89,63,221,45,90,63,198,202,90,63,50,102,91,63,33,0,92,63,147,152,92,63,134,47,93,63,251,196,93,63,242,88,94,63,105,235,94,63,98,124,95,63,219,11,96,63,213,153,96,63,80,38,97,63,76,177,97,63,201,58,98,63,199,194,98,63,70,73,99,63,71,206,99,63,202,81,100,63,208,211,100,63,88,84,101,63,100,211,101,63,244,80,102,63,9,205,102,63,163,71,103,63,195,192,103,63,107,56,104,63,154,174,104,63,82,35,105,63,147,150,105,63,96,8,106,63,184,120,106,63,157,231,106,63,16,85,107,63,19,193,107,63,166,43,108,63,203,148,108,63,132,252,108,63,209,98,109,63,180,199,109,63,48,43,110,63,68,141,110,63,244,237,110,63,64,77,111,63,42,171,111,63,181,7,112,63,225,98,112,63,177,188,112,63,38,21,113,63,67,108,113,63,10,194,113,63,123,22,114,63,155,105,114,63,106,187,114,63,234,11,115,63,31,91,115,63,9,169,115,63,172,245,115,63,9,65,116,63,35,139,116,63,252,211,116,63,151,27,117,63,245,97,117,63,26,167,117,63,8,235,117,63,193,45,118,63,72,111,118,63,159,175,118,63,202,238,118,63,201,44,119,63,161,105,119,63,84,165,119,63,228,223,119,63,85,25,120,63,168,81,120,63,226,136,120,63,3,191,120,63,16,244,120,63,11,40,121,63,247,90,121,63,215,140,121,63,173,189,121,63,125,237,121,63,73,28,122,63,20,74,122,63,226,118,122,63,181,162,122,63,144,205,122,63,118,247,122,63,107,32,123,63,112,72,123,63,138,111,123,63,186,149,123,63,5,187,123,63,109,223,123,63,245,2,124,63,160,37,124,63,113,71,124,63,108,104,124,63,147,136,124,63,233,167,124,63,114,198,124,63,48,228,124,63,38,1,125,63,89,29,125,63,201,56,125,63,124,83,125,63,115,109,125,63,178,134,125,63,60,159,125,63,19,183,125,63,60,206,125,63,184,228,125,63,139,250,125,63,184,15,126,63,66,36,126,63,44,56,126,63,120,75,126,63,43,94,126,63,70,112,126,63,204,129,126,63,194,146,126,63,41,163,126,63,4,179,126,63,86,194,126,63,35,209,126,63,109,223,126,63,55,237,126,63,131,250,126,63,85,7,127,63,175,19,127,63,148,31,127,63,7,43,127,63,10,54,127,63,160,64,127,63,205,74,127,63,146,84,127,63,242,93,127,63,239,102,127,63,141,111,127,63,206,119,127,63,181,127,127,63,67,135,127,63,124,142,127,63,98,149,127,63,247,155,127,63,61,162,127,63,56,168,127,63,233,173,127,63,83,179,127,63,120,184,127,63,90,189,127,63,252,193,127,63,95,198,127,63,134,202,127,63,116,206,127,63,41,210,127,63,168,213,127,63,244,216,127,63,13,220,127,63,247,222,127,63,179,225,127,63,67,228,127,63,168,230,127,63,229,232,127,63,252,234,127,63,237,236,127,63,188,238,127,63,105,240,127,63,246,241,127,63,101,243,127,63,183,244,127,63,238,245,127,63,11,247,127,63,16,248,127,63,254,248,127,63,214,249,127,63,155,250,127,63,76,251,127,63,236,251,127,63,124,252,127,63,252,252,127,63,110,253,127,63,211,253,127,63,44,254,127,63,121,254,127,63,189,254,127,63,247,254,127,63,42,255,127,63,84,255,127,63,120,255,127,63,150,255,127,63,175,255,127,63,195,255,127,63,211,255,127,63,224,255,127,63,234,255,127,63,241,255,127,63,246,255,127,63,250,255,127,63,253,255,127,63,254,255,127,63,255,255,127,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,171,15,120,53,24,135,11,55,225,201,193,55,107,233,61,56,128,247,156,56,187,122,234,56,24,191,35,57,213,0,90,57,56,1,140,57,229,225,174,57,88,162,213,57,60,33,0,58,24,97,23,58,175,144,48,58,243,175,75,58,212,190,104,58,159,222,131,58,143,85,148,58,48,196,165,58,119,42,184,58,90,136,203,58,204,221,223,58,191,42,245,58,148,183,5,59,124,85,17,59,16,111,29,59,73,4,42,59,31,21,55,59,138,161,68,59,129,169,82,59,252,44,97,59,241,43,112,59,88,166,127,59,19,206,135,59,169,6,144,59,233,124,152,59,204,48,161,59,79,34,170,59,106,81,179,59,26,190,188,59,86,104,198,59,26,80,208,59,95,117,218,59,31,216,228,59,83,120,239,59,244,85,250,59,126,184,2,60,177,100,8,60,145,47,14,60,25,25,20,60,70,33,26,60,19,72,32,60,126,141,38,60,129,241,44,60,25,116,51,60,65,21,58,60,246,212,64,60,50,179,71,60,243,175,78,60,50,203,85,60,235,4,93,60,26,93,100,60,186,211,107,60,198,104,115,60,58,28,123,60,7,119,129,60,33,111,133,60,102,118,137,60,212,140,141,60,105,178,145,60,33,231,149,60,251,42,154,60,243,125,158,60,6,224,162,60,50,81,167,60,115,209,171,60,199,96,176,60,43,255,180,60,154,172,185,60,19,105,190,60,146,52,195,60,20,15,200,60,149,248,204,60,19,241,209,60,137,248,214,60,245,14,220,60,83,52,225,60,160,104,230,60,215,171,235,60,246,253,240,60,249,94,246,60,220,206,251,60,205,166,0,61,153,109,3,61,207,59,6,61,109,17,9,61,114,238,11,61,220,210,14,61,167,190,17,61,211,177,20,61,94,172,23,61,68,174,26,61,133,183,29,61,30,200,32,61,12,224,35,61,78,255,38,61,225,37,42,61,196,83,45,61,243,136,48,61,109,197,51,61,47,9,55,61,55,84,58,61,130,166,61,61,15,0,65,61,218,96,68,61,226,200,71,61,35,56,75,61,156,174,78,61,73,44,82,61,40,177,85,61,55,61,89,61,115,208,92,61,217,106,96,61,103,12,100,61,25,181,103,61,238,100,107,61,227,27,111,61,244,217,114,61,30,159,118,61,96,107,122,61,182,62,126,61,143,12,129,61,73,253,130,61,138,241,132,61,79,233,134,61,150,228,136,61,94,227,138,61,167,229,140,61,109,235,142,61,175,244,144,61,109,1,147,61,164,17,149,61,83,37,151,61,120,60,153,61,17,87,155,61,30,117,157,61,155,150,159,61,136,187,161,61,226,227,163,61,169,15,166,61,218,62,168,61,116,113,170,61,116,167,172,61,218,224,174,61,162,29,177,61,205,93,179,61,87,161,181,61,62,232,183,61,130,50,186,61,32,128,188,61,22,209,190,61,98,37,193,61,2,125,195,61,245,215,197,61,57,54,200,61,203,151,202,61,169,252,204,61,211,100,207,61,68,208,209,61,252,62,212,61,249,176,214,61,56,38,217,61,184,158,219,61,117,26,222,61,111,153,224,61,163,27,227,61,14,161,229,61,175,41,232,61,132,181,234,61,138,68,237,61,191,214,239,61,33,108,242,61,174,4,245,61,99,160,247,61,62,63,250,61,61,225,252,61,93,134,255,61,78,23,1,62,252,108,2,62,56,196,3,62,255,28,5,62,81,119,6,62,45,211,7,62,145,48,9,62,125,143,10,62,238,239,11,62,228,81,13,62,94,181,14,62,89,26,16,62,214,128,17,62,210,232,18,62,77,82,20,62,69,189,21,62,184,41,23,62,166,151,24,62,13,7,26,62,236,119,27,62,65,234,28,62,11,94,30,62,73,211,31,62,250,73,33,62,28,194,34,62,173,59,36,62,172,182,37,62,24,51,39,62,240,176,40,62,50,48,42,62,220,176,43,62,238,50,45,62,101,182,46,62,64,59,48,62,126,193,49,62,30,73,51,62,29,210,52,62,123,92,54,62,54,232,55,62,76,117,57,62,187,3,59,62,131,147,60,62,162,36,62,62,22,183,63,62,222,74,65,62,248,223,66,62,98,118,68,62,28,14,70,62,35,167,71,62,117,65,73,62,18,221,74,62,247,121,76,62,35,24,78,62,149,183,79,62,74,88,81,62,66,250,82,62,121,157,84,62,240,65,86,62,163,231,87,62,146,142,89,62,186,54,91,62,26,224,92,62,177,138,94,62,124,54,96,62,122,227,97,62,169,145,99,62,7,65,101,62,147,241,102,62,75,163,104,62,44,86,106,62,54,10,108,62,102,191,109,62,187,117,111,62,51,45,113,62,204,229,114,62,132,159,116,62,90,90,118,62,75,22,120,62,85,211,121,62,120,145,123,62,176,80,125,62,253,16,127,62,46,105,128,62,101,74,129,62,36,44,130,62,105,14,131,62,52,241,131,62,130,212,132,62,84,184,133,62,169,156,134,62,127,129,135,62,213,102,136,62,171,76,137,62,255,50,138,62,209,25,139,62,32,1,140,62,233,232,140,62,46,209,141,62,236,185,142,62,34,163,143,62,208,140,144,62,244,118,145,62,142,97,146,62,156,76,147,62,29,56,148,62,17,36,149,62,118,16,150,62,76,253,150,62,144,234,151,62,67,216,152,62,99,198,153,62,239,180,154,62,230,163,155,62,71,147,156,62,17,131,157,62,67,115,158,62,219,99,159,62,218,84,160,62,60,70,161,62,3,56,162,62,43,42,163,62,181,28,164,62,160,15,165,62,233,2,166,62,145,246,166,62,149,234,167,62,245,222,168,62,176,211,169,62,197,200,170,62,50,190,171,62,246,179,172,62,17,170,173,62,129,160,174,62,69,151,175,62,91,142,176,62,196,133,177,62,125,125,178,62,133,117,179,62,220,109,180,62,128,102,181,62,112,95,182,62,171,88,183,62,47,82,184,62,252,75,185,62,17,70,186,62,108,64,187,62,11,59,188,62,239,53,189,62,22,49,190,62,126,44,191,62,38,40,192,62,13,36,193,62,51,32,194,62,150,28,195,62,52,25,196,62,12,22,197,62,30,19,198,62,104,16,199,62,233,13,200,62,159,11,201,62,138,9,202,62,169,7,203,62,249,5,204,62,123,4,205,62,44,3,206,62,11,2,207,62,24,1,208,62,81,0,209,62,181,255,209,62,66,255,210,62,248,254,211,62,213,254,212,62,216,254,213,62,255,254,214,62,75,255,215,62,184,255,216,62,71,0,218,62,245,0,219,62,195,1,220,62,173,2,221,62,180,3,222,62,214,4,223,62,17,6,224,62,101,7,225,62,208,8,226,62,81,10,227,62,231,11,228,62,144,13,229,62,76,15,230,62,25,17,231,62,245,18,232,62,224,20,233,62,217,22,234,62,221,24,235,62,236,26,236,62,5,29,237,62,39,31,238,62,79,33,239,62,125,35,240,62,176,37,241,62,230,39,242,62,31,42,243,62,88,44,244,62,145,46,245,62,200,48,246,62,253,50,247,62,45,53,248,62,88,55,249,62,124,57,250,62,153,59,251,62,172,61,252,62,181,63,253,62,179,65,254,62,163,67,255,62,195,34,0,63,173,163,0,63,142,36,1,63,102,165,1,63,53,38,2,63,250,166,2,63,180,39,3,63,99,168,3,63,5,41,4,63,155,169,4,63,36,42,5,63,159,170,5,63,12,43,6,63,105,171,6,63,183,43,7,63,244,171,7,63,32,44,8,63,59,172,8,63,68,44,9,63,58,172,9,63,28,44,10,63,235,171,10,63,164,43,11,63,73,171,11,63,216,42,12,63,80,170,12,63,177,41,13,63,251,168,13,63,44,40,14,63,69,167,14,63,68,38,15,63,41,165,15,63,243,35,16,63,162,162,16,63,53,33,17,63,172,159,17,63,5,30,18,63,65,156,18,63,95,26,19,63,94,152,19,63,61,22,20,63,252,147,20,63,155,17,21,63,24,143,21,63,116,12,22,63,173,137,22,63,195,6,23,63,182,131,23,63,133,0,24,63,46,125,24,63,179,249,24,63,18,118,25,63,74,242,25,63,91,110,26,63,69,234,26,63,6,102,27,63,159,225,27,63,14,93,28,63,84,216,28,63,111,83,29,63,95,206,29,63,36,73,30,63,188,195,30,63,40,62,31,63,102,184,31,63,119,50,32,63,90,172,32,63,14,38,33,63,146,159,33,63,230,24,34,63,10,146,34,63,253,10,35,63,190,131,35,63,77,252,35,63,169,116,36,63,211,236,36,63,200,100,37,63,138,220,37,63,22,84,38,63,110,203,38,63,143,66,39,63,122,185,39,63,47,48,40,63,172,166,40,63,241,28,41,63,254,146,41,63,210,8,42,63,108,126,42,63,205,243,42,63,243,104,43,63,223,221,43,63,143,82,44,63,3,199,44,63,59,59,45,63,54,175,45,63,244,34,46,63,116,150,46,63,182,9,47,63,185,124,47,63,125,239,47,63,1,98,48,63,69,212,48,63,72,70,49,63,10,184,49,63,139,41,50,63,202,154,50,63,198,11,51,63,127,124,51,63,246,236,51,63,40,93,52,63,22,205,52,63,191,60,53,63,36,172,53,63,66,27,54,63,27,138,54,63,174,248,54,63,249,102,55,63,254,212,55,63,187,66,56,63,47,176,56,63,91,29,57,63,63,138,57,63,217,246,57,63,41,99,58,63,48,207,58,63,236,58,59,63,93,166,59,63,130,17,60,63,93,124,60,63,235,230,60,63,44,81,61,63,33,187,61,63,201,36,62,63,35,142,62,63,48,247,62,63,238,95,63,63,94,200,63,63,126,48,64,63,80,152,64,63,209,255,64,63,3,103,65,63,228,205,65,63,117,52,66,63,181,154,66,63,163,0,67,63,64,102,67,63,139,203,67,63,131,48,68,63,41,149,68,63,124,249,68,63,123,93,69,63,39,193,69,63,127,36,70,63,132,135,70,63,51,234,70,63,142,76,71,63,148,174,71,63,68,16,72,63,159,113,72,63,164,210,72,63,83,51,73,63,172,147,73,63,174,243,73,63,89,83,74,63,173,178,74,63,169,17,75,63,77,112,75,63,154,206,75,63,143,44,76,63,43,138,76,63,110,231,76,63,89,68,77,63,234,160,77,63,34,253,77,63,0,89,78,63,133,180,78,63,176,15,79,63,128,106,79,63,246,196,79,63,18,31,80,63,210,120,80,63,56,210,80,63,66,43,81,63,242,131,81,63,69,220,81,63,61,52,82,63,217,139,82,63,24,227,82,63,252,57,83,63,131,144,83,63,174,230,83,63,123,60,84,63,236,145,84,63,0,231,84,63,183,59,85,63,16,144,85,63,12,228,85,63,170,55,86,63,235,138,86,63,206,221,86,63,83,48,87,63,121,130,87,63,66,212,87,63,172,37,88,63,184,118,88,63,101,199,88,63,180,23,89,63,164,103,89,63,53,183,89,63,104,6,90,63,59,85,90,63,175,163,90,63,197,241,90,63,123,63,91,63,210,140,91,63,201,217,91,63,97,38,92,63,154,114,92,63,115,190,92,63,237,9,93,63,7,85,93,63,194,159,93,63,29,234,93,63,24,52,94,63,179,125,94,63,239,198,94,63,203,15,95,63,72,88,95,63,100,160,95,63,33,232,95,63,126,47,96,63,123,118,96,63,24,189,96,63,85,3,97,63,51,73,97,63,177,142,97,63,207,211,97,63,141,24,98,63,236,92,98,63,235,160,98,63,138,228,98,63,202,39,99,63,170,106,99,63,42,173,99,63,75,239,99,63,13,49,100,63,111,114,100,63,114,179,100,63,21,244,100,63,90,52,101,63,63,116,101,63,197,179,101,63,236,242,101,63,180,49,102,63,29,112,102,63,39,174,102,63,211,235,102,63,32,41,103,63,15,102,103,63,159,162,103,63,209,222,103,63,164,26,104,63,26,86,104,63,49,145,104,63,235,203,104,63,71,6,105,63,69,64,105,63,230,121,105,63,42,179,105,63,16,236,105,63,153,36,106,63,197,92,106,63,148,148,106,63,7,204,106,63,29,3,107,63,214,57,107,63,52,112,107,63,53,166,107,63,218,219,107,63,36,17,108,63,18,70,108,63,164,122,108,63,220,174,108,63,184,226,108,63,57,22,109,63,96,73,109,63,44,124,109,63,157,174,109,63,181,224,109,63,115,18,110,63,214,67,110,63,225,116,110,63,146,165,110,63,233,213,110,63,232,5,111,63,142,53,111,63,219,100,111,63,209,147,111,63,110,194,111,63,179,240,111,63,160,30,112,63,54,76,112,63,117,121,112,63,93,166,112,63,239,210,112,63,41,255,112,63,14,43,113,63,156,86,113,63,213,129,113,63,184,172,113,63,70,215,113,63,127,1,114,63,99,43,114,63,243,84,114,63,46,126,114,63,21,167,114,63,169,207,114,63,233,247,114,63,214,31,115,63,113,71,115,63,184,110,115,63,173,149,115,63,80,188,115,63,162,226,115,63,161,8,116,63,80,46,116,63,174,83,116,63,187,120,116,63,119,157,116,63,228,193,116,63,1,230,116,63,206,9,117,63,76,45,117,63,123,80,117,63,92,115,117,63,238,149,117,63,51,184,117,63,42,218,117,63,211,251,117,63,48,29,118,63,64,62,118,63,3,95,118,63,122,127,118,63,166,159,118,63,134,191,118,63,27,223,118,63,101,254,118,63,101,29,119,63,27,60,119,63,135,90,119,63,169,120,119,63,131,150,119,63,19,180,119,63,91,209,119,63,91,238,119,63,20,11,120,63,132,39,120,63,174,67,120,63,145,95,120,63,46,123,120,63,132,150,120,63,149,177,120,63,96,204,120,63,231,230,120,63,41,1,121,63,38,27,121,63,223,52,121,63,85,78,121,63,136,103,121,63,120,128,121,63,37,153,121,63,144,177,121,63,185,201,121,63,161,225,121,63,72,249,121,63,174,16,122,63,212,39,122,63,185,62,122,63,96,85,122,63,198,107,122,63,238,129,122,63,216,151,122,63,131,173,122,63,241,194,122,63,33,216,122,63,20,237,122,63,202,1,123,63,68,22,123,63,130,42,123,63,133,62,123,63,77,82,123,63,217,101,123,63,43,121,123,63,68,140,123,63,34,159,123,63,200,177,123,63,52,196,123,63,104,214,123,63,99,232,123,63,39,250,123,63,180,11,124,63,9,29,124,63,40,46,124,63,17,63,124,63,196,79,124,63,65,96,124,63,137,112,124,63,156,128,124,63,124,144,124,63,39,160,124,63,158,175,124,63,226,190,124,63,244,205,124,63,211,220,124,63,128,235,124,63,251,249,124,63,69,8,125,63,94,22,125,63,71,36,125,63,255,49,125,63,136,63,125,63,225,76,125,63,11,90,125,63,7,103,125,63,212,115,125,63,115,128,125,63,229,140,125,63,42,153,125,63,66,165,125,63,46,177,125,63,238,188,125,63,130,200,125,63,235,211,125,63,41,223,125,63,61,234,125,63,38,245,125,63,230,255,125,63,124,10,126,63,234,20,126,63,47,31,126,63,75,41,126,63,64,51,126,63,13,61,126,63,180,70,126,63,51,80,126,63,140,89,126,63,191,98,126,63,205,107,126,63,181,116,126,63,120,125,126,63,23,134,126,63,146,142,126,63,233,150,126,63,28,159,126,63,44,167,126,63,26,175,126,63,229,182,126,63,142,190,126,63,22,198,126,63,124,205,126,63,194,212,126,63,231,219,126,63,235,226,126,63,208,233,126,63,149,240,126,63,59,247,126,63,195,253,126,63,44,4,127,63,118,10,127,63,163,16,127,63,179,22,127,63,165,28,127,63,123,34,127,63,52,40,127,63,210,45,127,63,83,51,127,63,186,56,127,63,5,62,127,63,53,67,127,63,75,72,127,63,72,77,127,63,42,82,127,63,243,86,127,63,163,91,127,63,58,96,127,63,185,100,127,63,32,105,127,63,111,109,127,63,166,113,127,63,199,117,127,63,208,121,127,63,196,125,127,63,161,129,127,63,104,133,127,63,25,137,127,63,182,140,127,63,61,144,127,63,176,147,127,63,14,151,127,63,89,154,127,63,143,157,127,63,179,160,127,63,195,163,127,63,192,166,127,63,171,169,127,63,132,172,127,63,74,175,127,63,255,177,127,63,163,180,127,63,53,183,127,63,183,185,127,63,40,188,127,63,137,190,127,63,217,192,127,63,26,195,127,63,76,197,127,63,111,199,127,63,130,201,127,63,135,203,127,63,126,205,127,63,102,207,127,63,65,209,127,63,14,211,127,63,205,212,127,63,128,214,127,63,38,216,127,63,191,217,127,63,76,219,127,63,204,220,127,63,65,222,127,63,170,223,127,63,8,225,127,63,91,226,127,63,163,227,127,63,224,228,127,63,19,230,127,63,59,231,127,63,90,232,127,63,110,233,127,63,122,234,127,63,124,235,127,63,116,236,127,63,100,237,127,63,75,238,127,63,42,239,127,63,1,240,127,63,207,240,127,63,149,241,127,63,84,242,127,63,12,243,127,63,188,243,127,63,101,244,127,63,7,245,127,63,162,245,127,63,55,246,127,63,198,246,127,63,78,247,127,63,209,247,127,63,77,248,127,63,196,248,127,63,54,249,127,63,162,249,127,63,9,250,127,63,108,250,127,63,201,250,127,63,34,251,127,63,118,251,127,63,198,251,127,63,18,252,127,63,89,252,127,63,157,252,127,63,221,252,127,63,26,253,127,63,83,253,127,63,136,253,127,63,187,253,127,63,234,253,127,63,22,254,127,63,64,254,127,63,103,254,127,63,139,254,127,63,173,254,127,63,204,254,127,63,234,254,127,63,5,255,127,63,30,255,127,63,53,255,127,63,74,255,127,63,94,255,127,63,112,255,127,63,128,255,127,63,143,255,127,63,157,255,127,63,169,255,127,63,180,255,127,63,191,255,127,63,200,255,127,63,208,255,127,63,215,255,127,63,221,255,127,63,227,255,127,63,232,255,127,63,236,255,127,63,239,255,127,63,243,255,127,63,245,255,127,63,248,255,127,63,249,255,127,63,251,255,127,63,252,255,127,63,253,255,127,63,254,255,127,63,255,255,127,63,255,255,127,63,255,255,127,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,204,8,120,52,171,134,11,54,79,202,193,54,190,233,61,55,238,247,156,55,192,123,234,55,43,192,35,56,161,2,90,56,189,2,140,56,76,228,174,56,227,165,213,56,199,35,0,57,168,100,23,57,134,149,48,57,104,182,75,57,64,199,104,57,7,228,131,57,105,92,148,57,191,204,165,57,6,53,184,57,65,149,203,57,105,237,223,57,120,61,245,57,184,194,5,58,166,98,17,58,134,126,29,58,81,22,42,58,9,42,55,58,172,185,68,58,54,197,82,58,165,76,97,58,250,79,112,58,47,207,127,58,34,229,135,58,154,32,144,58,255,153,152,58,80,81,161,58,139,70,170,58,174,121,179,58,186,234,188,58,171,153,198,58,129,134,208,58,58,177,218,58,212,25,229,58,79,192,239,58,167,164,250,58,109,227,2,59,117,147,8,59,105,98,14,59,73,80,20,59,19,93,26,59,199,136,32,59,100,211,38,59,232,60,45,59,83,197,51,59,164,108,58,59,218,50,65,59,243,23,72,59,239,27,79,59,204,62,86,59,138,128,93,59,38,225,100,59,161,96,108,59,249,254,115,59,45,188,123,59,29,204,129,59,145,201,133,59,113,214,137,59,188,242,141,59,113,30,146,59,145,89,150,59,26,164,154,59,12,254,158,59,102,103,163,59,40,224,167,59,80,104,172,59,222,255,176,59,209,166,181,59,40,93,186,59,228,34,191,59,2,248,195,59,131,220,200,59,101,208,205,59,168,211,210,59,74,230,215,59,76,8,221,59,172,57,226,59,105,122,231,59,131,202,236,59,249,41,242,59,202,152,247,59,245,22,253,59,60,82,1,60,170,32,4,60,196,246,6,60,137,212,9,60,249,185,12,60,19,167,15,60,216,155,18,60,69,152,21,60,92,156,24,60,26,168,27,60,129,187,30,60,143,214,33,60,69,249,36,60,160,35,40,60,162,85,43,60,73,143,46,60,149,208,49,60,133,25,53,60,26,106,56,60,81,194,59,60,44,34,63,60,168,137,66,60,199,248,69,60,134,111,73,60,230,237,76,60,231,115,80,60,134,1,84,60,197,150,87,60,162,51,91,60,28,216,94,60,52,132,98,60,232,55,102,60,56,243,105,60,35,182,109,60,170,128,113,60,202,82,117,60,131,44,121,60,214,13,125,60,96,123,128,60,161,115,130,60,174,111,132,60,134,111,134,60,40,115,136,60,149,122,138,60,205,133,140,60,206,148,142,60,152,167,144,60,44,190,146,60,136,216,148,60,173,246,150,60,154,24,153,60,78,62,155,60,202,103,157,60,13,149,159,60,23,198,161,60,231,250,163,60,125,51,166,60,217,111,168,60,249,175,170,60,223,243,172,60,137,59,175,60,247,134,177,60,40,214,179,60,29,41,182,60,213,127,184,60,80,218,186,60,140,56,189,60,138,154,191,60,74,0,194,60,202,105,196,60,11,215,198,60,12,72,201,60,205,188,203,60,77,53,206,60,140,177,208,60,137,49,211,60,69,181,213,60,189,60,216,60,243,199,218,60,230,86,221,60,149,233,223,60,0,128,226,60,39,26,229,60,8,184,231,60,164,89,234,60,250,254,236,60,9,168,239,60,210,84,242,60,83,5,245,60,141,185,247,60,126,113,250,60,39,45,253,60,134,236,255,60,206,87,1,61,52,187,2,61,117,32,4,61,144,135,5,61,133,240,6,61,84,91,8,61,253,199,9,61,128,54,11,61,219,166,12,61,16,25,14,61,29,141,15,61,3,3,17,61,193,122,18,61,87,244,19,61,197,111,21,61,10,237,22,61,39,108,24,61,26,237,25,61,228,111,27,61,132,244,28,61,251,122,30,61,71,3,32,61,105,141,33,61,96,25,35,61,45,167,36,61,206,54,38,61,67,200,39,61,141,91,41,61,171,240,42,61,156,135,44,61,96,32,46,61,248,186,47,61,99,87,49,61,160,245,50,61,175,149,52,61,144,55,54,61,67,219,55,61,199,128,57,61,28,40,59,61,65,209,60,61,56,124,62,61,254,40,64,61,148,215,65,61,250,135,67,61,47,58,69,61,51,238,70,61,5,164,72,61,166,91,74,61,20,21,76,61,80,208,77,61,90,141,79,61,49,76,81,61,212,12,83,61,68,207,84,61,128,147,86,61,135,89,88,61,90,33,90,61,248,234,91,61,97,182,93,61,148,131,95,61,145,82,97,61,88,35,99,61,232,245,100,61,65,202,102,61,100,160,104,61,78,120,106,61,1,82,108,61,123,45,110,61,188,10,112,61,197,233,113,61,148,202,115,61,41,173,117,61,133,145,119,61,166,119,121,61,140,95,123,61,55,73,125,61,166,52,127,61,237,144,128,61,105,136,129,61,198,128,130,61,5,122,131,61,37,116,132,61,39,111,133,61,9,107,134,61,204,103,135,61,112,101,136,61,244,99,137,61,88,99,138,61,157,99,139,61,193,100,140,61,196,102,141,61,167,105,142,61,106,109,143,61,11,114,144,61,139,119,145,61,234,125,146,61,40,133,147,61,67,141,148,61,61,150,149,61,20,160,150,61,201,170,151,61,92,182,152,61,203,194,153,61,24,208,154,61,66,222,155,61,72,237,156,61,42,253,157,61,233,13,159,61,132,31,160,61,250,49,161,61,76,69,162,61,122,89,163,61,130,110,164,61,101,132,165,61,35,155,166,61,188,178,167,61,47,203,168,61,124,228,169,61,162,254,170,61,163,25,172,61,124,53,173,61,47,82,174,61,187,111,175,61,31,142,176,61,92,173,177,61,113,205,178,61,94,238,179,61,35,16,181,61,192,50,182,61,52,86,183,61,127,122,184,61,160,159,185,61,153,197,186,61,104,236,187,61,13,20,189,61,136,60,190,61,217,101,191,61,255,143,192,61,250,186,193,61,202,230,194,61,111,19,196,61,233,64,197,61,55,111,198,61,89,158,199,61,78,206,200,61,23,255,201,61,179,48,203,61,35,99,204,61,101,150,205,61,121,202,206,61,96,255,207,61,25,53,209,61,164,107,210,61,0,163,211,61,45,219,212,61,44,20,214,61,251,77,215,61,154,136,216,61,10,196,217,61,74,0,219,61,89,61,220,61,56,123,221,61,230,185,222,61,99,249,223,61,174,57,225,61,200,122,226,61,176,188,227,61,102,255,228,61,233,66,230,61,58,135,231,61,88,204,232,61,66,18,234,61,249,88,235,61,124,160,236,61,203,232,237,61,230,49,239,61,204,123,240,61,125,198,241,61,249,17,243,61,63,94,244,61,79,171,245,61,42,249,246,61,206,71,248,61,60,151,249,61,114,231,250,61,114,56,252,61,58,138,253,61,202,220,254,61,17,24,0,62,33,194,0,62,149,108,1,62,108,23,2,62,166,194,2,62,68,110,3,62,69,26,4,62,168,198,4,62,111,115,5,62,152,32,6,62,35,206,6,62,17,124,7,62,98,42,8,62,20,217,8,62,40,136,9,62,157,55,10,62,117,231,10,62,173,151,11,62,71,72,12,62,66,249,12,62,158,170,13,62,91,92,14,62,120,14,15,62,246,192,15,62,213,115,16,62,19,39,17,62,177,218,17,62,175,142,18,62,13,67,19,62,202,247,19,62,231,172,20,62,99,98,21,62,62,24,22,62,120,206,22,62,16,133,23,62,7,60,24,62,92,243,24,62,16,171,25,62,33,99,26,62,145,27,27,62,94,212,27,62,137,141,28,62,17,71,29,62,246,0,30,62,56,187,30,62,215,117,31,62,211,48,32,62,43,236,32,62,224,167,33,62,241,99,34,62,93,32,35,62,38,221,35,62,74,154,36,62,202,87,37,62,165,21,38,62,219,211,38,62,108,146,39,62,88,81,40,62,159,16,41,62,64,208,41,62,59,144,42,62,144,80,43,62,63,17,44,62,72,210,44,62,170,147,45,62,102,85,46,62,122,23,47,62,232,217,47,62,175,156,48,62,206,95,49,62,69,35,50,62,21,231,50,62,61,171,51,62,189,111,52,62,148,52,53,62,195,249,53,62,73,191,54,62,38,133,55,62,91,75,56,62,230,17,57,62,199,216,57,62,255,159,58,62,141,103,59,62,113,47,60,62,171,247,60,62,59,192,61,62,31,137,62,62,89,82,63,62,232,27,64,62,204,229,64,62,5,176,65,62,146,122,66,62,115,69,67,62,168,16,68,62,49,220,68,62,14,168,69,62,62,116,70,62,194,64,71,62,152,13,72,62,193,218,72,62,61,168,73,62,12,118,74,62,44,68,75,62,159,18,76,62,100,225,76,62,122,176,77,62,225,127,78,62,154,79,79,62,164,31,80,62,255,239,80,62,170,192,81,62,166,145,82,62,242,98,83,62,141,52,84,62,121,6,85,62,180,216,85,62,63,171,86,62,25,126,87,62,65,81,88,62,185,36,89,62,126,248,89,62,147,204,90,62,245,160,91,62,165,117,92,62,163,74,93,62,238,31,94,62,135,245,94,62,109,203,95,62,159,161,96,62,30,120,97,62,233,78,98,62,1,38,99,62,100,253,99,62,19,213,100,62,14,173,101,62,84,133,102,62,229,93,103,62,193,54,104,62,231,15,105,62,88,233,105,62,19,195,106,62,24,157,107,62,103,119,108,62,255,81,109,62,224,44,110,62,11,8,111,62,126,227,111,62,58,191,112,62,62,155,113,62,139,119,114,62,31,84,115,62,251,48,116,62,31,14,117,62,138,235,117,62,59,201,118,62,52,167,119,62,115,133,120,62,248,99,121,62,196,66,122,62,213,33,123,62,44,1,124,62,200,224,124,62,170,192,125,62,208,160,126,62,59,129,127,62,245,48,128,62,111,161,128,62,11,18,129,62,201,130,129,62,168,243,129,62,169,100,130,62,204,213,130,62,15,71,131,62,117,184,131,62,251,41,132,62,162,155,132,62,107,13,133,62,84,127,133,62,93,241,133,62,136,99,134,62,210,213,134,62,61,72,135,62,200,186,135,62,116,45,136,62,63,160,136,62,42,19,137,62,52,134,137,62,94,249,137,62,168,108,138,62,17,224,138,62,153,83,139,62,64,199,139,62,6,59,140,62,235,174,140,62,239,34,141,62,17,151,141,62,82,11,142,62,177,127,142,62,46,244,142,62,201,104,143,62,130,221,143,62,89,82,144,62,78,199,144,62,96,60,145,62,143,177,145,62,220,38,146,62,70,156,146,62,205,17,147,62,113,135,147,62,50,253,147,62,16,115,148,62,9,233,148,62,32,95,149,62,82,213,149,62,161,75,150,62,12,194,150,62,146,56,151,62,53,175,151,62,243,37,152,62,204,156,152,62,193,19,153,62,209,138,153,62,252,1,154,62,66,121,154,62,163,240,154,62,31,104,155,62,181,223,155,62,101,87,156,62,48,207,156,62,21,71,157,62,20,191,157,62,45,55,158,62,96,175,158,62,172,39,159,62,18,160,159,62,145,24,160,62,41,145,160,62,218,9,161,62,165,130,161,62,136,251,161,62,132,116,162,62,152,237,162,62,197,102,163,62,10,224,163,62,103,89,164,62,220,210,164,62,105,76,165,62,14,198,165,62,202,63,166,62,158,185,166,62,137,51,167,62,139,173,167,62,164,39,168,62,213,161,168,62,27,28,169,62,121,150,169,62,237,16,170,62,119,139,170,62,24,6,171,62,206,128,171,62,155,251,171,62,125,118,172,62,117,241,172,62,130,108,173,62,165,231,173,62,221,98,174,62,42,222,174,62,140,89,175,62,2,213,175,62,142,80,176,62,46,204,176,62,226,71,177,62,170,195,177,62,135,63,178,62,119,187,178,62,124,55,179,62,148,179,179,62,191,47,180,62,254,171,180,62,80,40,181,62,181,164,181,62,45,33,182,62,184,157,182,62,85,26,183,62,5,151,183,62,199,19,184,62,156,144,184,62,130,13,185,62,123,138,185,62,133,7,186,62,161,132,186,62,206,1,187,62,13,127,187,62,93,252,187,62,190,121,188,62,48,247,188,62,178,116,189,62,70,242,189,62,233,111,190,62,157,237,190,62,98,107,191,62,54,233,191,62,26,103,192,62,14,229,192,62,17,99,193,62,36,225,193,62,70,95,194,62,119,221,194,62,184,91,195,62,7,218,195,62,100,88,196,62,209,214,196,62,75,85,197,62,212,211,197,62,107,82,198,62,16,209,198,62,195,79,199,62,132,206,199,62,82,77,200,62,45,204,200,62,21,75,201,62,11,202,201,62,13,73,202,62,29,200,202,62,56,71,203,62,97,198,203,62,149,69,204,62,214,196,204,62,34,68,205,62,123,195,205,62,223,66,206,62,79,194,206,62,202,65,207,62,81,193,207,62,226,64,208,62,127,192,208,62,38,64,209,62,216,191,209,62,148,63,210,62,91,191,210,62,44,63,211,62,7,191,211,62,235,62,212,62,218,190,212,62,210,62,213,62,211,190,213,62,222,62,214,62,242,190,214,62,15,63,215,62,53,191,215,62,99,63,216,62,154,191,216,62,217,63,217,62,32,192,217,62,112,64,218,62,199,192,218,62,38,65,219,62,140,193,219,62,250,65,220,62,112,194,220,62,236,66,221,62,112,195,221,62,250,67,222,62,139,196,222,62,34,69,223,62,192,197,223,62,100,70,224,62,14,199,224,62,189,71,225,62,115,200,225,62,46,73,226,62,239,201,226,62,181,74,227,62,127,203,227,62,79,76,228,62,36,205,228,62,253,77,229,62,219,206,229,62,190,79,230,62,164,208,230,62,142,81,231,62,125,210,231,62,111,83,232,62,100,212,232,62,93,85,233,62,89,214,233,62,89,87,234,62,91,216,234,62,96,89,235,62,104,218,235,62,114,91,236,62,126,220,236,62,141,93,237,62,158,222,237,62,176,95,238,62,196,224,238,62,218,97,239,62,241,226,239,62,10,100,240,62,35,229,240,62,62,102,241,62,89,231,241,62,116,104,242,62,145,233,242,62,173,106,243,62,202,235,243,62,230,108,244,62,3,238,244,62,31,111,245,62,59,240,245,62,86,113,246,62,112,242,246,62,137,115,247,62,161,244,247,62,184,117,248,62,206,246,248,62,226,119,249,62,244,248,249,62,4,122,250,62,18,251,250,62,30,124,251,62,40,253,251,62,47,126,252,62,52,255,252,62,54,128,253,62,52,1,254,62,48,130,254,62,40,3,255,62,29,132,255,62,135,2,0,63,254,66,0,63,115,131,0,63,230,195,0,63,86,4,1,63,197,68,1,63,49,133,1,63,155,197,1,63,3,6,2,63,103,70,2,63,202,134,2,63,42,199,2,63,135,7,3,63,225,71,3,63,56,136,3,63,141,200,3,63,222,8,4,63,44,73,4,63,119,137,4,63,191,201,4,63,3,10,5,63,68,74,5,63,130,138,5,63,188,202,5,63,242,10,6,63,36,75,6,63,83,139,6,63,126,203,6,63,165,11,7,63,199,75,7,63,230,139,7,63,1,204,7,63,23,12,8,63,41,76,8,63,54,140,8,63,63,204,8,63,67,12,9,63,67,76,9,63,62,140,9,63,52,204,9,63,37,12,10,63,18,76,10,63,249,139,10,63,219,203,10,63,184,11,11,63,144,75,11,63,98,139,11,63,47,203,11,63,246,10,12,63,184,74,12,63,116,138,12,63,43,202,12,63,219,9,13,63,134,73,13,63,43,137,13,63,202,200,13,63,98,8,14,63,245,71,14,63,129,135,14,63,7,199,14,63,135,6,15,63,0,70,15,63,114,133,15,63,222,196,15,63,67,4,16,63,161,67,16,63,249,130,16,63,73,194,16,63,147,1,17,63,213,64,17,63,17,128,17,63,69,191,17,63,114,254,17,63,151,61,18,63,181,124,18,63,203,187,18,63,218,250,18,63,225,57,19,63,225,120,19,63,216,183,19,63,200,246,19,63,176,53,20,63,143,116,20,63,103,179,20,63,54,242,20,63,253,48,21,63,188,111,21,63,114,174,21,63,32,237,21,63,197,43,22,63,98,106,22,63,246,168,22,63,129,231,22,63,3,38,23,63,125,100,23,63,237,162,23,63,84,225,23,63,178,31,24,63,7,94,24,63,83,156,24,63,149,218,24,63,206,24,25,63,253,86,25,63,35,149,25,63,63,211,25,63,82,17,26,63,90,79,26,63,89,141,26,63,78,203,26,63,57,9,27,63,25,71,27,63,240,132,27,63,188,194,27,63,126,0,28,63,54,62,28,63,227,123,28,63,134,185,28,63,30,247,28,63,172,52,29,63,47,114,29,63,167,175,29,63,20,237,29,63,118,42,30,63,206,103,30,63,26,165,30,63,91,226,30,63,145,31,31,63,188,92,31,63,219,153,31,63,239,214,31,63,247,19,32,63,244,80,32,63,230,141,32,63,203,202,32,63,165,7,33,63,115,68,33,63,53,129,33,63,235,189,33,63,150,250,33,63,52,55,34,63,198,115,34,63,75,176,34,63,197,236,34,63,50,41,35,63,146,101,35,63,230,161,35,63,46,222,35,63,105,26,36,63,151,86,36,63,185,146,36,63,205,206,36,63,213,10,37,63,208,70,37,63,190,130,37,63,158,190,37,63,114,250,37,63,56,54,38,63,241,113,38,63,157,173,38,63,59,233,38,63,204,36,39,63,79,96,39,63,197,155,39,63,45,215,39,63,135,18,40,63,211,77,40,63,18,137,40,63,66,196,40,63,101,255,40,63,121,58,41,63,128,117,41,63,120,176,41,63,98,235,41,63,62,38,42,63,11,97,42,63,202,155,42,63,122,214,42,63,28,17,43,63,175,75,43,63,52,134,43,63,170,192,43,63,16,251,43,63,105,53,44,63,178,111,44,63,236,169,44,63,23,228,44,63,51,30,45,63,64,88,45,63,61,146,45,63,43,204,45,63,10,6,46,63,218,63,46,63,154,121,46,63,74,179,46,63,235,236,46,63,124,38,47,63,254,95,47,63,112,153,47,63,210,210,47,63,36,12,48,63,102,69,48,63,152,126,48,63,186,183,48,63,204,240,48,63,205,41,49,63,191,98,49,63,160,155,49,63,113,212,49,63,49,13,50,63,225,69,50,63,128,126,50,63,15,183,50,63,141,239,50,63,251,39,51,63,87,96,51,63,163,152,51,63,222,208,51,63,8,9,52,63,34,65,52,63,42,121,52,63,33,177,52,63,7,233,52,63,219,32,53,63,159,88,53,63,81,144,53,63,242,199,53,63,129,255,53,63,255,54,54,63,108,110,54,63,198,165,54,63,16,221,54,63,71,20,55,63,109,75,55,63,129,130,55,63,131,185,55,63,116,240,55,63,82,39,56,63,30,94,56,63,217,148,56,63,129,203,56,63,23,2,57,63,155,56,57,63,13,111,57,63,108,165,57,63,185,219,57,63,244,17,58,63,28,72,58,63,50,126,58,63,53,180,58,63,38,234,58,63,4,32,59,63,207,85,59,63,135,139,59,63,45,193,59,63,192,246,59,63,64,44,60,63,173,97,60,63,7,151,60,63,78,204,60,63,130,1,61,63,163,54,61,63,177,107,61,63,171,160,61,63,146,213,61,63,102,10,62,63,39,63,62,63,212,115,62,63,110,168,62,63,244,220,62,63,103,17,63,63,198,69,63,63,17,122,63,63,73,174,63,63,109,226,63,63,126,22,64,63,122,74,64,63,99,126,64,63,56,178,64,63,248,229,64,63,165,25,65,63,62,77,65,63,195,128,65,63,52,180,65,63,144,231,65,63,216,26,66,63,13,78,66,63,44,129,66,63,56,180,66,63,47,231,66,63,18,26,67,63,224,76,67,63,154,127,67,63,64,178,67,63,208,228,67,63,77,23,68,63,180,73,68,63,7,124,68,63,69,174,68,63,111,224,68,63,131,18,69,63,131,68,69,63,110,118,69,63,68,168,69,63,5,218,69,63,177,11,70,63,72,61,70,63,202,110,70,63,55,160,70,63,143,209,70,63,210,2,71,63,255,51,71,63,23,101,71,63,26,150,71,63,8,199,71,63,224,247,71,63,163,40,72,63,81,89,72,63,233,137,72,63,107,186,72,63,216,234,72,63,48,27,73,63,114,75,73,63,158,123,73,63,181,171,73,63,181,219,73,63,161,11,74,63,118,59,74,63,54,107,74,63,224,154,74,63,116,202,74,63,242,249,74,63,90,41,75,63,173,88,75,63,233,135,75,63,15,183,75,63,32,230,75,63,26,21,76,63,254,67,76,63,204,114,76,63,132,161,76,63,38,208,76,63,177,254,76,63,38,45,77,63,133,91,77,63,206,137,77,63,0,184,77,63,28,230,77,63,34,20,78,63,17,66,78,63,234,111,78,63,172,157,78,63,88,203,78,63,238,248,78,63,108,38,79,63,213,83,79,63,38,129,79,63,97,174,79,63,134,219,79,63,147,8,80,63,138,53,80,63,107,98,80,63,52,143,80,63,231,187,80,63,131,232,80,63,8,21,81,63,119,65,81,63,206,109,81,63,15,154,81,63], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+30720);
/* memory initializer */ allocate([57,198,81,63,76,242,81,63,71,30,82,63,44,74,82,63,250,117,82,63,177,161,82,63,81,205,82,63,218,248,82,63,76,36,83,63,166,79,83,63,234,122,83,63,22,166,83,63,44,209,83,63,42,252,83,63,17,39,84,63,224,81,84,63,153,124,84,63,58,167,84,63,196,209,84,63,54,252,84,63,146,38,85,63,214,80,85,63,2,123,85,63,24,165,85,63,22,207,85,63,252,248,85,63,204,34,86,63,131,76,86,63,36,118,86,63,172,159,86,63,30,201,86,63,120,242,86,63,186,27,87,63,229,68,87,63,248,109,87,63,244,150,87,63,216,191,87,63,165,232,87,63,90,17,88,63,248,57,88,63,126,98,88,63,236,138,88,63,67,179,88,63,130,219,88,63,169,3,89,63,185,43,89,63,177,83,89,63,145,123,89,63,90,163,89,63,11,203,89,63,164,242,89,63,37,26,90,63,143,65,90,63,225,104,90,63,27,144,90,63,62,183,90,63,72,222,90,63,59,5,91,63,22,44,91,63,217,82,91,63,133,121,91,63,24,160,91,63,148,198,91,63,248,236,91,63,68,19,92,63,120,57,92,63,149,95,92,63,153,133,92,63,134,171,92,63,91,209,92,63,24,247,92,63,189,28,93,63,74,66,93,63,191,103,93,63,28,141,93,63,98,178,93,63,143,215,93,63,165,252,93,63,162,33,94,63,136,70,94,63,86,107,94,63,11,144,94,63,169,180,94,63,47,217,94,63,157,253,94,63,243,33,95,63,49,70,95,63,88,106,95,63,102,142,95,63,92,178,95,63,59,214,95,63,1,250,95,63,175,29,96,63,70,65,96,63,196,100,96,63,43,136,96,63,122,171,96,63,176,206,96,63,207,241,96,63,214,20,97,63,197,55,97,63,155,90,97,63,90,125,97,63,1,160,97,63,144,194,97,63,8,229,97,63,103,7,98,63,174,41,98,63,221,75,98,63,245,109,98,63,244,143,98,63,220,177,98,63,171,211,98,63,99,245,98,63,3,23,99,63,139,56,99,63,251,89,99,63,83,123,99,63,147,156,99,63,188,189,99,63,204,222,99,63,197,255,99,63,166,32,100,63,110,65,100,63,32,98,100,63,185,130,100,63,58,163,100,63,164,195,100,63,245,227,100,63,47,4,101,63,82,36,101,63,92,68,101,63,78,100,101,63,41,132,101,63,236,163,101,63,151,195,101,63,43,227,101,63,167,2,102,63,11,34,102,63,87,65,102,63,139,96,102,63,168,127,102,63,174,158,102,63,155,189,102,63,113,220,102,63,47,251,102,63,214,25,103,63,101,56,103,63,220,86,103,63,59,117,103,63,132,147,103,63,180,177,103,63,205,207,103,63,206,237,103,63,184,11,104,63,138,41,104,63,69,71,104,63,233,100,104,63,116,130,104,63,233,159,104,63,69,189,104,63,139,218,104,63,185,247,104,63,207,20,105,63,207,49,105,63,182,78,105,63,135,107,105,63,64,136,105,63,225,164,105,63,108,193,105,63,223,221,105,63,59,250,105,63,127,22,106,63,172,50,106,63,195,78,106,63,193,106,106,63,169,134,106,63,121,162,106,63,51,190,106,63,213,217,106,63,96,245,106,63,212,16,107,63,48,44,107,63,118,71,107,63,165,98,107,63,188,125,107,63,189,152,107,63,167,179,107,63,121,206,107,63,53,233,107,63,218,3,108,63,104,30,108,63,223,56,108,63,63,83,108,63,136,109,108,63,187,135,108,63,214,161,108,63,219,187,108,63,201,213,108,63,161,239,108,63,97,9,109,63,11,35,109,63,159,60,109,63,27,86,109,63,129,111,109,63,209,136,109,63,9,162,109,63,44,187,109,63,56,212,109,63,45,237,109,63,12,6,110,63,212,30,110,63,134,55,110,63,33,80,110,63,166,104,110,63,21,129,110,63,110,153,110,63,176,177,110,63,220,201,110,63,241,225,110,63,241,249,110,63,218,17,111,63,173,41,111,63,106,65,111,63,16,89,111,63,161,112,111,63,28,136,111,63,128,159,111,63,207,182,111,63,7,206,111,63,42,229,111,63,54,252,111,63,45,19,112,63,14,42,112,63,217,64,112,63,142,87,112,63,46,110,112,63,184,132,112,63,43,155,112,63,138,177,112,63,210,199,112,63,5,222,112,63,35,244,112,63,42,10,113,63,29,32,113,63,249,53,113,63,193,75,113,63,114,97,113,63,15,119,113,63,150,140,113,63,7,162,113,63,99,183,113,63,170,204,113,63,220,225,113,63,249,246,113,63,0,12,114,63,242,32,114,63,207,53,114,63,151,74,114,63,73,95,114,63,231,115,114,63,112,136,114,63,227,156,114,63,66,177,114,63,140,197,114,63,193,217,114,63,225,237,114,63,236,1,115,63,227,21,115,63,197,41,115,63,146,61,115,63,74,81,115,63,238,100,115,63,125,120,115,63,248,139,115,63,94,159,115,63,175,178,115,63,236,197,115,63,21,217,115,63,41,236,115,63,41,255,115,63,21,18,116,63,236,36,116,63,175,55,116,63,94,74,116,63,248,92,116,63,127,111,116,63,241,129,116,63,80,148,116,63,154,166,116,63,208,184,116,63,242,202,116,63,1,221,116,63,251,238,116,63,226,0,117,63,181,18,117,63,116,36,117,63,31,54,117,63,183,71,117,63,59,89,117,63,171,106,117,63,8,124,117,63,81,141,117,63,135,158,117,63,169,175,117,63,184,192,117,63,179,209,117,63,155,226,117,63,112,243,117,63,50,4,118,63,224,20,118,63,123,37,118,63,3,54,118,63,120,70,118,63,217,86,118,63,40,103,118,63,100,119,118,63,140,135,118,63,162,151,118,63,165,167,118,63,149,183,118,63,114,199,118,63,61,215,118,63,245,230,118,63,154,246,118,63,44,6,119,63,172,21,119,63,26,37,119,63,117,52,119,63,189,67,119,63,243,82,119,63,22,98,119,63,40,113,119,63,39,128,119,63,19,143,119,63,238,157,119,63,182,172,119,63,108,187,119,63,16,202,119,63,162,216,119,63,34,231,119,63,144,245,119,63,236,3,120,63,55,18,120,63,111,32,120,63,150,46,120,63,170,60,120,63,174,74,120,63,159,88,120,63,127,102,120,63,77,116,120,63,10,130,120,63,181,143,120,63,79,157,120,63,215,170,120,63,78,184,120,63,180,197,120,63,8,211,120,63,76,224,120,63,126,237,120,63,158,250,120,63,174,7,121,63,173,20,121,63,155,33,121,63,119,46,121,63,67,59,121,63,254,71,121,63,168,84,121,63,66,97,121,63,202,109,121,63,66,122,121,63,169,134,121,63,0,147,121,63,70,159,121,63,124,171,121,63,161,183,121,63,181,195,121,63,186,207,121,63,173,219,121,63,145,231,121,63,100,243,121,63,40,255,121,63,219,10,122,63,126,22,122,63,16,34,122,63,147,45,122,63,6,57,122,63,105,68,122,63,188,79,122,63,255,90,122,63,51,102,122,63,86,113,122,63,106,124,122,63,111,135,122,63,99,146,122,63,72,157,122,63,30,168,122,63,228,178,122,63,155,189,122,63,66,200,122,63,218,210,122,63,99,221,122,63,221,231,122,63,71,242,122,63,162,252,122,63,238,6,123,63,43,17,123,63,89,27,123,63,120,37,123,63,137,47,123,63,138,57,123,63,124,67,123,63,96,77,123,63,53,87,123,63,252,96,123,63,179,106,123,63,92,116,123,63,247,125,123,63,131,135,123,63,1,145,123,63,112,154,123,63,209,163,123,63,36,173,123,63,104,182,123,63,158,191,123,63,198,200,123,63,224,209,123,63,236,218,123,63,234,227,123,63,218,236,123,63,188,245,123,63,144,254,123,63,86,7,124,63,14,16,124,63,185,24,124,63,86,33,124,63,230,41,124,63,104,50,124,63,220,58,124,63,67,67,124,63,156,75,124,63,232,83,124,63,39,92,124,63,88,100,124,63,124,108,124,63,147,116,124,63,157,124,124,63,153,132,124,63,137,140,124,63,107,148,124,63,65,156,124,63,9,164,124,63,197,171,124,63,116,179,124,63,22,187,124,63,172,194,124,63,52,202,124,63,176,209,124,63,32,217,124,63,131,224,124,63,217,231,124,63,35,239,124,63,97,246,124,63,146,253,124,63,183,4,125,63,208,11,125,63,221,18,125,63,221,25,125,63,209,32,125,63,185,39,125,63,150,46,125,63,102,53,125,63,42,60,125,63,227,66,125,63,143,73,125,63,48,80,125,63,197,86,125,63,78,93,125,63,204,99,125,63,62,106,125,63,165,112,125,63,0,119,125,63,80,125,125,63,148,131,125,63,205,137,125,63,251,143,125,63,29,150,125,63,52,156,125,63,64,162,125,63,65,168,125,63,55,174,125,63,34,180,125,63,2,186,125,63,215,191,125,63,161,197,125,63,96,203,125,63,21,209,125,63,190,214,125,63,93,220,125,63,242,225,125,63,124,231,125,63,251,236,125,63,112,242,125,63,218,247,125,63,58,253,125,63,143,2,126,63,219,7,126,63,28,13,126,63,82,18,126,63,127,23,126,63,161,28,126,63,186,33,126,63,200,38,126,63,204,43,126,63,199,48,126,63,183,53,126,63,158,58,126,63,123,63,126,63,78,68,126,63,23,73,126,63,215,77,126,63,141,82,126,63,58,87,126,63,221,91,126,63,118,96,126,63,6,101,126,63,141,105,126,63,10,110,126,63,126,114,126,63,233,118,126,63,75,123,126,63,164,127,126,63,243,131,126,63,57,136,126,63,119,140,126,63,171,144,126,63,214,148,126,63,249,152,126,63,18,157,126,63,35,161,126,63,44,165,126,63,43,169,126,63,34,173,126,63,16,177,126,63,246,180,126,63,211,184,126,63,167,188,126,63,115,192,126,63,55,196,126,63,243,199,126,63,166,203,126,63,81,207,126,63,243,210,126,63,142,214,126,63,32,218,126,63,171,221,126,63,45,225,126,63,167,228,126,63,26,232,126,63,132,235,126,63,231,238,126,63,66,242,126,63,149,245,126,63,224,248,126,63,36,252,126,63,96,255,126,63,148,2,127,63,193,5,127,63,230,8,127,63,4,12,127,63,27,15,127,63,42,18,127,63,50,21,127,63,50,24,127,63,43,27,127,63,29,30,127,63,8,33,127,63,236,35,127,63,201,38,127,63,158,41,127,63,109,44,127,63,53,47,127,63,246,49,127,63,175,52,127,63,99,55,127,63,15,58,127,63,181,60,127,63,83,63,127,63,236,65,127,63,125,68,127,63,8,71,127,63,141,73,127,63,11,76,127,63,131,78,127,63,244,80,127,63,95,83,127,63,195,85,127,63,33,88,127,63,121,90,127,63,203,92,127,63,23,95,127,63,92,97,127,63,155,99,127,63,213,101,127,63,8,104,127,63,54,106,127,63,93,108,127,63,127,110,127,63,155,112,127,63,177,114,127,63,193,116,127,63,203,118,127,63,208,120,127,63,207,122,127,63,201,124,127,63,189,126,127,63,171,128,127,63,148,130,127,63,120,132,127,63,86,134,127,63,47,136,127,63,2,138,127,63,209,139,127,63,153,141,127,63,93,143,127,63,28,145,127,63,213,146,127,63,137,148,127,63,57,150,127,63,227,151,127,63,136,153,127,63,40,155,127,63,196,156,127,63,90,158,127,63,236,159,127,63,121,161,127,63,1,163,127,63,132,164,127,63,3,166,127,63,125,167,127,63,242,168,127,63,99,170,127,63,207,171,127,63,55,173,127,63,154,174,127,63,249,175,127,63,84,177,127,63,170,178,127,63,251,179,127,63,73,181,127,63,146,182,127,63,215,183,127,63,24,185,127,63,85,186,127,63,141,187,127,63,193,188,127,63,242,189,127,63,30,191,127,63,71,192,127,63,107,193,127,63,140,194,127,63,168,195,127,63,193,196,127,63,214,197,127,63,231,198,127,63,245,199,127,63,255,200,127,63,5,202,127,63,7,203,127,63,6,204,127,63,1,205,127,63,249,205,127,63,237,206,127,63,222,207,127,63,203,208,127,63,181,209,127,63,156,210,127,63,127,211,127,63,95,212,127,63,59,213,127,63,20,214,127,63,234,214,127,63,189,215,127,63,141,216,127,63,90,217,127,63,35,218,127,63,233,218,127,63,173,219,127,63,109,220,127,63,43,221,127,63,229,221,127,63,156,222,127,63,81,223,127,63,3,224,127,63,178,224,127,63,94,225,127,63,7,226,127,63,174,226,127,63,82,227,127,63,243,227,127,63,146,228,127,63,46,229,127,63,199,229,127,63,94,230,127,63,242,230,127,63,132,231,127,63,19,232,127,63,160,232,127,63,42,233,127,63,178,233,127,63,56,234,127,63,187,234,127,63,60,235,127,63,187,235,127,63,55,236,127,63,177,236,127,63,41,237,127,63,159,237,127,63,18,238,127,63,132,238,127,63,243,238,127,63,96,239,127,63,204,239,127,63,53,240,127,63,156,240,127,63,1,241,127,63,101,241,127,63,198,241,127,63,37,242,127,63,131,242,127,63,222,242,127,63,56,243,127,63,144,243,127,63,231,243,127,63,59,244,127,63,142,244,127,63,223,244,127,63,46,245,127,63,124,245,127,63,200,245,127,63,19,246,127,63,91,246,127,63,163,246,127,63,233,246,127,63,45,247,127,63,111,247,127,63,177,247,127,63,240,247,127,63,47,248,127,63,108,248,127,63,167,248,127,63,225,248,127,63,26,249,127,63,82,249,127,63,136,249,127,63,188,249,127,63,240,249,127,63,34,250,127,63,83,250,127,63,131,250,127,63,178,250,127,63,224,250,127,63,12,251,127,63,55,251,127,63,97,251,127,63,138,251,127,63,178,251,127,63,217,251,127,63,255,251,127,63,36,252,127,63,72,252,127,63,107,252,127,63,141,252,127,63,173,252,127,63,205,252,127,63,237,252,127,63,11,253,127,63,40,253,127,63,69,253,127,63,96,253,127,63,123,253,127,63,149,253,127,63,174,253,127,63,199,253,127,63,222,253,127,63,245,253,127,63,12,254,127,63,33,254,127,63,54,254,127,63,74,254,127,63,93,254,127,63,112,254,127,63,130,254,127,63,148,254,127,63,165,254,127,63,181,254,127,63,197,254,127,63,212,254,127,63,227,254,127,63,241,254,127,63,254,254,127,63,11,255,127,63,24,255,127,63,36,255,127,63,47,255,127,63,59,255,127,63,69,255,127,63,79,255,127,63,89,255,127,63,99,255,127,63,108,255,127,63,116,255,127,63,124,255,127,63,132,255,127,63,140,255,127,63,147,255,127,63,154,255,127,63,160,255,127,63,166,255,127,63,172,255,127,63,178,255,127,63,183,255,127,63,188,255,127,63,193,255,127,63,197,255,127,63,202,255,127,63,206,255,127,63,209,255,127,63,213,255,127,63,216,255,127,63,220,255,127,63,223,255,127,63,225,255,127,63,228,255,127,63,230,255,127,63,233,255,127,63,235,255,127,63,237,255,127,63,239,255,127,63,240,255,127,63,242,255,127,63,243,255,127,63,245,255,127,63,246,255,127,63,247,255,127,63,248,255,127,63,249,255,127,63,250,255,127,63,251,255,127,63,251,255,127,63,252,255,127,63,252,255,127,63,253,255,127,63,253,255,127,63,254,255,127,63,254,255,127,63,254,255,127,63,255,255,127,63,255,255,127,63,255,255,127,63,255,255,127,63,255,255,127,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,198,63,120,51,98,136,11,53,151,200,193,53,80,233,61,54,183,247,156,54,46,124,234,54,153,192,35,55,244,2,90,55,56,3,140,55,227,228,174,55,177,166,213,55,108,36,0,56,146,101,23,56,201,150,48,56,18,184,75,56,81,201,104,56,94,229,131,56,29,94,148,56,229,206,165,56,167,55,184,56,128,152,203,56,85,241,223,56,36,66,245,56,126,197,5,57,238,101,17,57,99,130,29,57,207,26,42,57,63,47,55,57,179,191,68,57,30,204,82,57,141,84,97,57,243,88,112,57,94,217,127,57,227,234,135,57,18,39,144,57,64,161,152,57,105,89,161,57,146,79,170,57,181,131,179,57,215,245,188,57,245,165,198,57,14,148,208,57,34,192,218,57,46,42,229,57,57,210,239,57,60,184,250,57,27,238,2,58,22,159,8,58,13,111,14,58,0,94,20,58,239,107,26,58,218,152,32,58,192,228,38,58,161,79,45,58,124,217,51,58,83,130,58,58,37,74,65,58,240,48,72,58,182,54,79,58,116,91,86,58,45,159,93,58,222,1,101,58,136,131,108,58,42,36,116,58,196,227,123,58,44,225,129,58,241,223,133,58,49,238,137,58,238,11,142,58,37,57,146,58,215,117,150,58,5,194,154,58,174,29,159,58,209,136,163,58,110,3,168,58,134,141,172,58,24,39,177,58,36,208,181,58,169,136,186,58,169,80,191,58,33,40,196,58,19,15,201,58,126,5,206,58,98,11,211,58,191,32,216,58,148,69,221,58,225,121,226,58,166,189,231,58,227,16,237,58,152,115,242,58,196,229,247,58,103,103,253,58,65,124,1,59,137,76,4,59,141,36,7,59,76,4,10,59,198,235,12,59,251,218,15,59,235,209,18,59,149,208,21,59,251,214,24,59,26,229,27,59,244,250,30,59,136,24,34,59,215,61,37,59,223,106,40,59,161,159,43,59,29,220,46,59,83,32,50,59,66,108,53,59,234,191,56,59,76,27,60,59,103,126,63,59,59,233,66,59,199,91,70,59,12,214,73,59,10,88,77,59,193,225,80,59,48,115,84,59,86,12,88,59,53,173,91,59,204,85,95,59,26,6,99,59,32,190,102,59,222,125,106,59,82,69,110,59,127,20,114,59,97,235,117,59,251,201,121,59,76,176,125,59,41,207,128,59,8,202,130,59,194,200,132,59,87,203,134,59,198,209,136,59,17,220,138,59,55,234,140,59,55,252,142,59,18,18,145,59,199,43,147,59,87,73,149,59,194,106,151,59,6,144,153,59,37,185,155,59,30,230,157,59,241,22,160,59,158,75,162,59,37,132,164,59,134,192,166,59,192,0,169,59,212,68,171,59,193,140,173,59,137,216,175,59,41,40,178,59,163,123,180,59,245,210,182,59,33,46,185,59,38,141,187,59,4,240,189,59,186,86,192,59,73,193,194,59,177,47,197,59,242,161,199,59,10,24,202,59,251,145,204,59,196,15,207,59,102,145,209,59,223,22,212,59,49,160,214,59,90,45,217,59,91,190,219,59,51,83,222,59,227,235,224,59,107,136,227,59,201,40,230,59,255,204,232,59,12,117,235,59,240,32,238,59,171,208,240,59,61,132,243,59,165,59,246,59,228,246,248,59,250,181,251,59,229,120,254,59,212,159,0,60,32,5,2,60,87,108,3,60,121,213,4,60,134,64,6,60,126,173,7,60,96,28,9,60,45,141,10,60,229,255,11,60,136,116,13,60,21,235,14,60,141,99,16,60,239,221,17,60,59,90,19,60,114,216,20,60,147,88,22,60,158,218,23,60,147,94,25,60,115,228,26,60,60,108,28,60,240,245,29,60,141,129,31,60,20,15,33,60,133,158,34,60,224,47,36,60,36,195,37,60,82,88,39,60,105,239,40,60,106,136,42,60,84,35,44,60,40,192,45,60,229,94,47,60,139,255,48,60,26,162,50,60,146,70,52,60,243,236,53,60,61,149,55,60,112,63,57,60,140,235,58,60,145,153,60,60,126,73,62,60,84,251,63,60,18,175,65,60,185,100,67,60,72,28,69,60,192,213,70,60,31,145,72,60,103,78,74,60,151,13,76,60,175,206,77,60,176,145,79,60,152,86,81,60,103,29,83,60,31,230,84,60,190,176,86,60,69,125,88,60,179,75,90,60,9,28,92,60,71,238,93,60,107,194,95,60,119,152,97,60,106,112,99,60,68,74,101,60,5,38,103,60,173,3,105,60,60,227,106,60,178,196,108,60,14,168,110,60,81,141,112,60,123,116,114,60,139,93,116,60,130,72,118,60,95,53,120,60,34,36,122,60,203,20,124,60,90,7,126,60,208,251,127,60,22,249,128,60,54,245,129,60,74,242,130,60,80,240,131,60,73,239,132,60,53,239,133,60,19,240,134,60,229,241,135,60,169,244,136,60,95,248,137,60,8,253,138,60,164,2,140,60,50,9,141,60,178,16,142,60,37,25,143,60,139,34,144,60,226,44,145,60,44,56,146,60,104,68,147,60,150,81,148,60,182,95,149,60,201,110,150,60,205,126,151,60,196,143,152,60,172,161,153,60,135,180,154,60,83,200,155,60,17,221,156,60,193,242,157,60,98,9,159,60,245,32,160,60,122,57,161,60,241,82,162,60,89,109,163,60,178,136,164,60,253,164,165,60,57,194,166,60,103,224,167,60,134,255,168,60,151,31,170,60,152,64,171,60,139,98,172,60,111,133,173,60,68,169,174,60,10,206,175,60,193,243,176,60,105,26,178,60,2,66,179,60,139,106,180,60,6,148,181,60,113,190,182,60,205,233,183,60,26,22,185,60,87,67,186,60,133,113,187,60,163,160,188,60,177,208,189,60,177,1,191,60,160,51,192,60,128,102,193,60,80,154,194,60,16,207,195,60,193,4,197,60,97,59,198,60,242,114,199,60,114,171,200,60,227,228,201,60,67,31,203,60,147,90,204,60,211,150,205,60,3,212,206,60,34,18,208,60,49,81,209,60,48,145,210,60,30,210,211,60,252,19,213,60,201,86,214,60,133,154,215,60,49,223,216,60,204,36,218,60,86,107,219,60,208,178,220,60,56,251,221,60,144,68,223,60,214,142,224,60,12,218,225,60,48,38,227,60,67,115,228,60,69,193,229,60,54,16,231,60,21,96,232,60,227,176,233,60,160,2,235,60,75,85,236,60,228,168,237,60,108,253,238,60,226,82,240,60,70,169,241,60,153,0,243,60,218,88,244,60,8,178,245,60,37,12,247,60,48,103,248,60,41,195,249,60,15,32,251,60,228,125,252,60,166,220,253,60,85,60,255,60,121,78,0,61,63,255,0,61,123,176,1,61,46,98,2,61,88,20,3,61,248,198,3,61,15,122,4,61,156,45,5,61,161,225,5,61,27,150,6,61,12,75,7,61,116,0,8,61,82,182,8,61,167,108,9,61,113,35,10,61,179,218,10,61,106,146,11,61,152,74,12,61,60,3,13,61,87,188,13,61,231,117,14,61,238,47,15,61,107,234,15,61,94,165,16,61,199,96,17,61,166,28,18,61,251,216,18,61,198,149,19,61,7,83,20,61,190,16,21,61,234,206,21,61,141,141,22,61,165,76,23,61,52,12,24,61,56,204,24,61,177,140,25,61,161,77,26,61,6,15,27,61,224,208,27,61,48,147,28,61,246,85,29,61,49,25,30,61,226,220,30,61,8,161,31,61,164,101,32,61,181,42,33,61,59,240,33,61,55,182,34,61,168,124,35,61,142,67,36,61,233,10,37,61,186,210,37,61,255,154,38,61,186,99,39,61,234,44,40,61,143,246,40,61,168,192,41,61,55,139,42,61,59,86,43,61,180,33,44,61,161,237,44,61,4,186,45,61,219,134,46,61,38,84,47,61,231,33,48,61,28,240,48,61,198,190,49,61,229,141,50,61,120,93,51,61,127,45,52,61,251,253,52,61,236,206,53,61,81,160,54,61,42,114,55,61,120,68,56,61,58,23,57,61,112,234,57,61,27,190,58,61,58,146,59,61,204,102,60,61,211,59,61,61,79,17,62,61,62,231,62,61,161,189,63,61,120,148,64,61,195,107,65,61,130,67,66,61,181,27,67,61,92,244,67,61,118,205,68,61,4,167,69,61,6,129,70,61,124,91,71,61,101,54,72,61,194,17,73,61,146,237,73,61,214,201,74,61,141,166,75,61,184,131,76,61,86,97,77,61,104,63,78,61,236,29,79,61,229,252,79,61,80,220,80,61,46,188,81,61,128,156,82,61,69,125,83,61,125,94,84,61,40,64,85,61,69,34,86,61,214,4,87,61,218,231,87,61,81,203,88,61,58,175,89,61,150,147,90,61,101,120,91,61,167,93,92,61,91,67,93,61,130,41,94,61,28,16,95,61,40,247,95,61,167,222,96,61,152,198,97,61,251,174,98,61,209,151,99,61,25,129,100,61,212,106,101,61,0,85,102,61,159,63,103,61,176,42,104,61,51,22,105,61,41,2,106,61,144,238,106,61,105,219,107,61,180,200,108,61,113,182,109,61,160,164,110,61,65,147,111,61,84,130,112,61,216,113,113,61,206,97,114,61,54,82,115,61,15,67,116,61,89,52,117,61,22,38,118,61,67,24,119,61,226,10,120,61,243,253,120,61,117,241,121,61,104,229,122,61,204,217,123,61,162,206,124,61,232,195,125,61,160,185,126,61,201,175,127,61,49,83,128,61,183,206,128,61,117,74,129,61,107,198,129,61,154,66,130,61,1,191,130,61,160,59,131,61,120,184,131,61,136,53,132,61,209,178,132,61,81,48,133,61,10,174,133,61,251,43,134,61,37,170,134,61,134,40,135,61,32,167,135,61,242,37,136,61,252,164,136,61,62,36,137,61,184,163,137,61,106,35,138,61,84,163,138,61,118,35,139,61,209,163,139,61,99,36,140,61,45,165,140,61,46,38,141,61,104,167,141,61,218,40,142,61,131,170,142,61,100,44,143,61,125,174,143,61,206,48,144,61,86,179,144,61,23,54,145,61,14,185,145,61,62,60,146,61,165,191,146,61,67,67,147,61,26,199,147,61,39,75,148,61,109,207,148,61,234,83,149,61,158,216,149,61,138,93,150,61,173,226,150,61,7,104,151,61,153,237,151,61,98,115,152,61,99,249,152,61,155,127,153,61,10,6,154,61,176,140,154,61,142,19,155,61,163,154,155,61,239,33,156,61,114,169,156,61,44,49,157,61,29,185,157,61,69,65,158,61,165,201,158,61,59,82,159,61,8,219,159,61,13,100,160,61,72,237,160,61,186,118,161,61,99,0,162,61,67,138,162,61,90,20,163,61,167,158,163,61,43,41,164,61,230,179,164,61,216,62,165,61,0,202,165,61,95,85,166,61,245,224,166,61,193,108,167,61,196,248,167,61,254,132,168,61,110,17,169,61,20,158,169,61,241,42,170,61,4,184,170,61,78,69,171,61,206,210,171,61,133,96,172,61,113,238,172,61,149,124,173,61,238,10,174,61,126,153,174,61,67,40,175,61,63,183,175,61,114,70,176,61,218,213,176,61,120,101,177,61,77,245,177,61,88,133,178,61,152,21,179,61,15,166,179,61,187,54,180,61,158,199,180,61,182,88,181,61,4,234,181,61,137,123,182,61,67,13,183,61,50,159,183,61,88,49,184,61,179,195,184,61,68,86,185,61,11,233,185,61,7,124,186,61,57,15,187,61,160,162,187,61,61,54,188,61,16,202,188,61,24,94,189,61,85,242,189,61,200,134,190,61,112,27,191,61,78,176,191,61,97,69,192,61,170,218,192,61,39,112,193,61,218,5,194,61,194,155,194,61,224,49,195,61,50,200,195,61,186,94,196,61,119,245,196,61,104,140,197,61,143,35,198,61,235,186,198,61,124,82,199,61,66,234,199,61,61,130,200,61,108,26,201,61,209,178,201,61,106,75,202,61,57,228,202,61,59,125,203,61,115,22,204,61,224,175,204,61,129,73,205,61,86,227,205,61,97,125,206,61,159,23,207,61,19,178,207,61,187,76,208,61,151,231,208,61,168,130,209,61,237,29,210,61,103,185,210,61,21,85,211,61,248,240,211,61,14,141,212,61,89,41,213,61,216,197,213,61,140,98,214,61,115,255,214,61,143,156,215,61,223,57,216,61,99,215,216,61,27,117,217,61,7,19,218,61,38,177,218,61,122,79,219,61,2,238,219,61,189,140,220,61,173,43,221,61,208,202,221,61,39,106,222,61,178,9,223,61,112,169,223,61,98,73,224,61,136,233,224,61,226,137,225,61,111,42,226,61,47,203,226,61,35,108,227,61,74,13,228,61,165,174,228,61,52,80,229,61,245,241,229,61,234,147,230,61,19,54,231,61,110,216,231,61,253,122,232,61,191,29,233,61,180,192,233,61,221,99,234,61,56,7,235,61,199,170,235,61,136,78,236,61,125,242,236,61,164,150,237,61,255,58,238,61,140,223,238,61,76,132,239,61,63,41,240,61,101,206,240,61,189,115,241,61,73,25,242,61,7,191,242,61,247,100,243,61,26,11,244,61,112,177,244,61,248,87,245,61,179,254,245,61,160,165,246,61,192,76,247,61,18,244,247,61,151,155,248,61,77,67,249,61,55,235,249,61,82,147,250,61,159,59,251,61,31,228,251,61,209,140,252,61,181,53,253,61,203,222,253,61,19,136,254,61,141,49,255,61,57,219,255,61,140,66,0,62,148,151,0,62,181,236,0,62,238,65,1,62,65,151,1,62,173,236,1,62,49,66,2,62,206,151,2,62,132,237,2,62,83,67,3,62,59,153,3,62,59,239,3,62,84,69,4,62,134,155,4,62,209,241,4,62,52,72,5,62,176,158,5,62,68,245,5,62,242,75,6,62,183,162,6,62,150,249,6,62,141,80,7,62,156,167,7,62,196,254,7,62,5,86,8,62,94,173,8,62,207,4,9,62,89,92,9,62,252,179,9,62,183,11,10,62,138,99,10,62,118,187,10,62,122,19,11,62,150,107,11,62,203,195,11,62,24,28,12,62,125,116,12,62,250,204,12,62,144,37,13,62,62,126,13,62,4,215,13,62,227,47,14,62,217,136,14,62,232,225,14,62,15,59,15,62,78,148,15,62,165,237,15,62,20,71,16,62,155,160,16,62,58,250,16,62,241,83,17,62,193,173,17,62,168,7,18,62,167,97,18,62,190,187,18,62,237,21,19,62,51,112,19,62,146,202,19,62,9,37,20,62,151,127,20,62,61,218,20,62,251,52,21,62,209,143,21,62,190,234,21,62,195,69,22,62,224,160,22,62,21,252,22,62,97,87,23,62,197,178,23,62,64,14,24,62,211,105,24,62,126,197,24,62,64,33,25,62,26,125,25,62,11,217,25,62,20,53,26,62,52,145,26,62,108,237,26,62,187,73,27,62,34,166,27,62,160,2,28,62,53,95,28,62,226,187,28,62,166,24,29,62,129,117,29,62,116,210,29,62,126,47,30,62,159,140,30,62,215,233,30,62,39,71,31,62,141,164,31,62,11,2,32,62,160,95,32,62,76,189,32,62,16,27,33,62,234,120,33,62,219,214,33,62,228,52,34,62,3,147,34,62,58,241,34,62,135,79,35,62,235,173,35,62,103,12,36,62,249,106,36,62,162,201,36,62,98,40,37,62,56,135,37,62,38,230,37,62,42,69,38,62,69,164,38,62,119,3,39,62,192,98,39,62,31,194,39,62,149,33,40,62,33,129,40,62,197,224,40,62,126,64,41,62,79,160,41,62,54,0,42,62,51,96,42,62,72,192,42,62,114,32,43,62,179,128,43,62,11,225,43,62,121,65,44,62,253,161,44,62,152,2,45,62,73,99,45,62,16,196,45,62,238,36,46,62,226,133,46,62,237,230,46,62,13,72,47,62,68,169,47,62,145,10,48,62,245,107,48,62,110,205,48,62,254,46,49,62,163,144,49,62,95,242,49,62,49,84,50,62,25,182,50,62,23,24,51,62,43,122,51,62,85,220,51,62,148,62,52,62,234,160,52,62,86,3,53,62,216,101,53,62,111,200,53,62,28,43,54,62,223,141,54,62,184,240,54,62,167,83,55,62,171,182,55,62,197,25,56,62,245,124,56,62,59,224,56,62,150,67,57,62,7,167,57,62,141,10,58,62,41,110,58,62,219,209,58,62,162,53,59,62,126,153,59,62,112,253,59,62,120,97,60,62,149,197,60,62,199,41,61,62,15,142,61,62,108,242,61,62,222,86,62,62,102,187,62,62,3,32,63,62,181,132,63,62,125,233,63,62,90,78,64,62,75,179,64,62,83,24,65,62,111,125,65,62,160,226,65,62,231,71,66,62,66,173,66,62,179,18,67,62,57,120,67,62,211,221,67,62,131,67,68,62,71,169,68,62,33,15,69,62,15,117,69,62,18,219,69,62,42,65,70,62,87,167,70,62,153,13,71,62,240,115,71,62,91,218,71,62,219,64,72,62,111,167,72,62,25,14,73,62,215,116,73,62,169,219,73,62,144,66,74,62,140,169,74,62,157,16,75,62,193,119,75,62,251,222,75,62,73,70,76,62,171,173,76,62,34,21,77,62,173,124,77,62,76,228,77,62,0,76,78,62,200,179,78,62,164,27,79,62,149,131,79,62,154,235,79,62,179,83,80,62,225,187,80,62,34,36,81,62,120,140,81,62,225,244,81,62,95,93,82,62,241,197,82,62,151,46,83,62,81,151,83,62,31,0,84,62,1,105,84,62,247,209,84,62,0,59,85,62,30,164,85,62,79,13,86,62,149,118,86,62,238,223,86,62,91,73,87,62,219,178,87,62,112,28,88,62,24,134,88,62,211,239,88,62,163,89,89,62,134,195,89,62,124,45,90,62,134,151,90,62,164,1,91,62,213,107,91,62,26,214,91,62,114,64,92,62,221,170,92,62,92,21,93,62,239,127,93,62,148,234,93,62,77,85,94,62,26,192,94,62,249,42,95,62,236,149,95,62,242,0,96,62,11,108,96,62,55,215,96,62,119,66,97,62,202,173,97,62,47,25,98,62,168,132,98,62,52,240,98,62,210,91,99,62,132,199,99,62,73,51,100,62,32,159,100,62,11,11,101,62,8,119,101,62,24,227,101,62,59,79,102,62,113,187,102,62,186,39,103,62,21,148,103,62,131,0,104,62,3,109,104,62,151,217,104,62,60,70,105,62,245,178,105,62,192,31,106,62,157,140,106,62,141,249,106,62,144,102,107,62,165,211,107,62,204,64,108,62,6,174,108,62,82,27,109,62,176,136,109,62,33,246,109,62,164,99,110,62,57,209,110,62,225,62,111,62,154,172,111,62,102,26,112,62,68,136,112,62,52,246,112,62,55,100,113,62,75,210,113,62,113,64,114,62,169,174,114,62,243,28,115,62,80,139,115,62,190,249,115,62,61,104,116,62,207,214,116,62,115,69,117,62,40,180,117,62,239,34,118,62,200,145,118,62,179,0,119,62,175,111,119,62,189,222,119,62,221,77,120,62,14,189,120,62,80,44,121,62,165,155,121,62,10,11,122,62,130,122,122,62,10,234,122,62,164,89,123,62,80,201,123,62,13,57,124,62,219,168,124,62,186,24,125,62,171,136,125,62,173,248,125,62,192,104,126,62,228,216,126,62,26,73,127,62,96,185,127,62,220,20,128,62,16,77,128,62,77,133,128,62,147,189,128,62,225,245,128,62,55,46,129,62,150,102,129,62,253,158,129,62,109,215,129,62,229,15,130,62,102,72,130,62,238,128,130,62,128,185,130,62,25,242,130,62,187,42,131,62,102,99,131,62,24,156,131,62,211,212,131,62,150,13,132,62,98,70,132,62,53,127,132,62,17,184,132,62,245,240,132,62,226,41,133,62,214,98,133,62,211,155,133,62,216,212,133,62,229,13,134,62,250,70,134,62,23,128,134,62,61,185,134,62,106,242,134,62,160,43,135,62,221,100,135,62,35,158,135,62,112,215,135,62,198,16,136,62,35,74,136,62,137,131,136,62,247,188,136,62,108,246,136,62,233,47,137,62,111,105,137,62,252,162,137,62,145,220,137,62,46,22,138,62,211,79,138,62,127,137,138,62,52,195,138,62,240,252,138,62,180,54,139,62,128,112,139,62,84,170,139,62,47,228,139,62,18,30,140,62,253,87,140,62,239,145,140,62,233,203,140,62,235,5,141,62,245,63,141,62,6,122,141,62,31,180,141,62,63,238,141,62,103,40,142,62,150,98,142,62,205,156,142,62,12,215,142,62,82,17,143,62,159,75,143,62,245,133,143,62,81,192,143,62,181,250,143,62,33,53,144,62,147,111,144,62,14,170,144,62,143,228,144,62,25,31,145,62,169,89,145,62,65,148,145,62,224,206,145,62,134,9,146,62,52,68,146,62,233,126,146,62,165,185,146,62,105,244,146,62,52,47,147,62,6,106,147,62,223,164,147,62,191,223,147,62,167,26,148,62,150,85,148,62,139,144,148,62,136,203,148,62,140,6,149,62,152,65,149,62,170,124,149,62,195,183,149,62,227,242,149,62,11,46,150,62,57,105,150,62,111,164,150,62,171,223,150,62,238,26,151,62,56,86,151,62,138,145,151,62,226,204,151,62,65,8,152,62,167,67,152,62,19,127,152,62,135,186,152,62,1,246,152,62,130,49,153,62,10,109,153,62,153,168,153,62,47,228,153,62,203,31,154,62,110,91,154,62,24,151,154,62,200,210,154,62,127,14,155,62,61,74,155,62,2,134,155,62,205,193,155,62,158,253,155,62,119,57,156,62,85,117,156,62,59,177,156,62,39,237,156,62,25,41,157,62,18,101,157,62,18,161,157,62,24,221,157,62,36,25,158,62,55,85,158,62,80,145,158,62,112,205,158,62,150,9,159,62,195,69,159,62,246,129,159,62,47,190,159,62,111,250,159,62,180,54,160,62,1,115,160,62,83,175,160,62,172,235,160,62,11,40,161,62,112,100,161,62,219,160,161,62,77,221,161,62,196,25,162,62,66,86,162,62,198,146,162,62,81,207,162,62,225,11,163,62,119,72,163,62,20,133,163,62,182,193,163,62,95,254,163,62,13,59,164,62,194,119,164,62,125,180,164,62,61,241,164,62,4,46,165,62,208,106,165,62,162,167,165,62,123,228,165,62,89,33,166,62,61,94,166,62,39,155,166,62,23,216,166,62,12,21,167,62,7,82,167,62,8,143,167,62,15,204,167,62,28,9,168,62,46,70,168,62,70,131,168,62,100,192,168,62,136,253,168,62,177,58,169,62,223,119,169,62,20,181,169,62,78,242,169,62,141,47,170,62,211,108,170,62,29,170,170,62,109,231,170,62,195,36,171,62,31,98,171,62,127,159,171,62,230,220,171,62,81,26,172,62,194,87,172,62,57,149,172,62,181,210,172,62,54,16,173,62,189,77,173,62,73,139,173,62,218,200,173,62,113,6,174,62,13,68,174,62,174,129,174,62,85,191,174,62,0,253,174,62,177,58,175,62,103,120,175,62,35,182,175,62,227,243,175,62,169,49,176,62,116,111,176,62,68,173,176,62,25,235,176,62,243,40,177,62,210,102,177,62,182,164,177,62,160,226,177,62,142,32,178,62,129,94,178,62,121,156,178,62,119,218,178,62,121,24,179,62,128,86,179,62,140,148,179,62,157,210,179,62,178,16,180,62,205,78,180,62,236,140,180,62,16,203,180,62,57,9,181,62,103,71,181,62,154,133,181,62,209,195,181,62,13,2,182,62,78,64,182,62,147,126,182,62,221,188,182,62,44,251,182,62,127,57,183,62,215,119,183,62,52,182,183,62,149,244,183,62,251,50,184,62,101,113,184,62,212,175,184,62,71,238,184,62,191,44,185,62,59,107,185,62,188,169,185,62,65,232,185,62,202,38,186,62,88,101,186,62,235,163,186,62,129,226,186,62,28,33,187,62,188,95,187,62,95,158,187,62,7,221,187,62,180,27,188,62,100,90,188,62,25,153,188,62,210,215,188,62,143,22,189,62,80,85,189,62,22,148,189,62,223,210,189,62,173,17,190,62,127,80,190,62,85,143,190,62,47,206,190,62,13,13,191,62,239,75,191,62,213,138,191,62,191,201,191,62,173,8,192,62,159,71,192,62,149,134,192,62,143,197,192,62,141,4,193,62,143,67,193,62,148,130,193,62,158,193,193,62,171,0,194,62,188,63,194,62,209,126,194,62,234,189,194,62,6,253,194,62,38,60,195,62,74,123,195,62,113,186,195,62,157,249,195,62,204,56,196,62,254,119,196,62,52,183,196,62,110,246,196,62,171,53,197,62,236,116,197,62,49,180,197,62,121,243,197,62,196,50,198,62,19,114,198,62,102,177,198,62,188,240,198,62,21,48,199,62,114,111,199,62,210,174,199,62,54,238,199,62,157,45,200,62,7,109,200,62,117,172,200,62,230,235,200,62,90,43,201,62,209,106,201,62,76,170,201,62,202,233,201,62,75,41,202,62,208,104,202,62,88,168,202,62,226,231,202,62,112,39,203,62,1,103,203,62,149,166,203,62,45,230,203,62,199,37,204,62,100,101,204,62,4,165,204,62,168,228,204,62,78,36,205,62,248,99,205,62,164,163,205,62,83,227,205,62,5,35,206,62,186,98,206,62,114,162,206,62,45,226,206,62,234,33,207,62,171,97,207,62,110,161,207,62,52,225,207,62,253,32,208,62,200,96,208,62,150,160,208,62,103,224,208,62,59,32,209,62,17,96,209,62,234,159,209,62,198,223,209,62,164,31,210,62,133,95,210,62,104,159,210,62,78,223,210,62,55,31,211,62,33,95,211,62,15,159,211,62,255,222,211,62,241,30,212,62,230,94,212,62,221,158,212,62,215,222,212,62,211,30,213,62,209,94,213,62,210,158,213,62,213,222,213,62,219,30,214,62,226,94,214,62,236,158,214,62,248,222,214,62,7,31,215,62,24,95,215,62,42,159,215,62,63,223,215,62,87,31,216,62,112,95,216,62,139,159,216,62,169,223,216,62,200,31,217,62,234,95,217,62,14,160,217,62,51,224,217,62,91,32,218,62,133,96,218,62,176,160,218,62,222,224,218,62,13,33,219,62,63,97,219,62,114,161,219,62,167,225,219,62,222,33,220,62,23,98,220,62,82,162,220,62,142,226,220,62,204,34,221,62,12,99,221,62,78,163,221,62,146,227,221,62,215,35,222,62,29,100,222,62,102,164,222,62,176,228,222,62,252,36,223,62,73,101,223,62,152,165,223,62,232,229,223,62,58,38,224,62,142,102,224,62,227,166,224,62,57,231,224,62,145,39,225,62,234,103,225,62,69,168,225,62,161,232,225,62,255,40,226,62,94,105,226,62,190,169,226,62,32,234,226,62,131,42,227,62,231,106,227,62,76,171,227,62,179,235,227,62,27,44,228,62,132,108,228,62,238,172,228,62,90,237,228,62,199,45,229,62,52,110,229,62,163,174,229,62,19,239,229,62,133,47,230,62,247,111,230,62,106,176,230,62,222,240,230,62,83,49,231,62,202,113,231,62,65,178,231,62,185,242,231,62,50,51,232,62,172,115,232,62,38,180,232,62,162,244,232,62,31,53,233,62,156,117,233,62,26,182,233,62,153,246,233,62,25,55,234,62,153,119,234,62,26,184,234,62,156,248,234,62,31,57,235,62,162,121,235,62,38,186,235,62,170,250,235,62,47,59,236,62,181,123,236,62,59,188,236,62,194,252,236,62,73,61,237,62,209,125,237,62,89,190,237,62,226,254,237,62,107,63,238,62,245,127,238,62,127,192,238,62,10,1,239,62,149,65,239,62,32,130,239,62,171,194,239,62,55,3,240,62,196,67,240,62,80,132,240,62,221,196,240,62,106,5,241,62,247,69,241,62,132,134,241,62,18,199,241,62,160,7,242,62,45,72,242,62,187,136,242,62,74,201,242,62,216,9,243,62,102,74,243,62,244,138,243,62,131,203,243,62,17,12,244,62,159,76,244,62,46,141,244,62,188,205,244,62,74,14,245,62,216,78,245,62,102,143,245,62,244,207,245,62,129,16,246,62,15,81,246,62,156,145,246,62,41,210,246,62,182,18,247,62,67,83,247,62,207,147,247,62,91,212,247,62,231,20,248,62,115,85,248,62,254,149,248,62,136,214,248,62,19,23,249,62,157,87,249,62,38,152,249,62,175,216,249,62,56,25,250,62,192,89,250,62,72,154,250,62,207,218,250,62,86,27,251,62,220,91,251,62,97,156,251,62,230,220,251,62,106,29,252,62,238,93,252,62,113,158,252,62,243,222,252,62,117,31,253,62,245,95,253,62,118,160,253,62,245,224,253,62,116,33,254,62,241,97,254,62,110,162,254,62,235,226,254,62,102,35,255,62,224,99,255,62,90,164,255,62,211,228,255,62,165,18,0,63,225,50,0,63,27,83,0,63,86,115,0,63,144,147,0,63,201,179,0,63,2,212,0,63,58,244,0,63,114,20,1,63,169,52,1,63,224,84,1,63,22,117,1,63,76,149,1,63,129,181,1,63,181,213,1,63,233,245,1,63,28,22,2,63,78,54,2,63,128,86,2,63,178,118,2,63,226,150,2,63,18,183,2,63,65,215,2,63,112,247,2,63,157,23,3,63,203,55,3,63,247,87,3,63,35,120,3,63,78,152,3,63,120,184,3,63,161,216,3,63,202,248,3,63,242,24,4,63,25,57,4,63,63,89,4,63,101,121,4,63,137,153,4,63,173,185,4,63,208,217,4,63,243,249,4,63,20,26,5,63,52,58,5,63,84,90,5,63,115,122,5,63,145,154,5,63,173,186,5,63,202,218,5,63,229,250,5,63,255,26,6,63,24,59,6,63,48,91,6,63,72,123,6,63,94,155,6,63,116,187,6,63,136,219,6,63,155,251,6,63,174,27,7,63,191,59,7,63,208,91,7,63,223,123,7,63,237,155,7,63,250,187,7,63,7,220,7,63,18,252,7,63,28,28,8,63,37,60,8,63,44,92,8,63,51,124,8,63,57,156,8,63,61,188,8,63,64,220,8,63,67,252,8,63,68,28,9,63,68,60,9,63,66,92,9,63,64,124,9,63,60,156,9,63], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+40960);
/* memory initializer */ allocate([55,188,9,63,49,220,9,63,41,252,9,63,33,28,10,63,23,60,10,63,12,92,10,63,255,123,10,63,242,155,10,63,227,187,10,63,211,219,10,63,193,251,10,63,174,27,11,63,154,59,11,63,133,91,11,63,110,123,11,63,86,155,11,63,60,187,11,63,33,219,11,63,5,251,11,63,231,26,12,63,200,58,12,63,168,90,12,63,134,122,12,63,98,154,12,63,62,186,12,63,23,218,12,63,240,249,12,63,199,25,13,63,156,57,13,63,112,89,13,63,66,121,13,63,19,153,13,63,227,184,13,63,176,216,13,63,125,248,13,63,72,24,14,63,17,56,14,63,216,87,14,63,159,119,14,63,99,151,14,63,38,183,14,63,232,214,14,63,167,246,14,63,101,22,15,63,34,54,15,63,221,85,15,63,150,117,15,63,78,149,15,63,4,181,15,63,184,212,15,63,106,244,15,63,27,20,16,63,202,51,16,63,120,83,16,63,36,115,16,63,206,146,16,63,118,178,16,63,28,210,16,63,193,241,16,63,100,17,17,63,6,49,17,63,165,80,17,63,67,112,17,63,223,143,17,63,121,175,17,63,17,207,17,63,167,238,17,63,60,14,18,63,206,45,18,63,95,77,18,63,238,108,18,63,123,140,18,63,7,172,18,63,144,203,18,63,23,235,18,63,157,10,19,63,32,42,19,63,162,73,19,63,34,105,19,63,159,136,19,63,27,168,19,63,149,199,19,63,13,231,19,63,131,6,20,63,247,37,20,63,104,69,20,63,216,100,20,63,70,132,20,63,178,163,20,63,27,195,20,63,131,226,20,63,233,1,21,63,76,33,21,63,174,64,21,63,13,96,21,63,106,127,21,63,197,158,21,63,31,190,21,63,117,221,21,63,202,252,21,63,29,28,22,63,109,59,22,63,188,90,22,63,8,122,22,63,82,153,22,63,153,184,22,63,223,215,22,63,34,247,22,63,100,22,23,63,162,53,23,63,223,84,23,63,26,116,23,63,82,147,23,63,136,178,23,63,187,209,23,63,237,240,23,63,28,16,24,63,73,47,24,63,115,78,24,63,155,109,24,63,193,140,24,63,228,171,24,63,6,203,24,63,36,234,24,63,65,9,25,63,91,40,25,63,115,71,25,63,136,102,25,63,155,133,25,63,171,164,25,63,185,195,25,63,197,226,25,63,206,1,26,63,213,32,26,63,217,63,26,63,219,94,26,63,218,125,26,63,215,156,26,63,210,187,26,63,202,218,26,63,191,249,26,63,178,24,27,63,162,55,27,63,144,86,27,63,123,117,27,63,100,148,27,63,74,179,27,63,46,210,27,63,15,241,27,63,237,15,28,63,201,46,28,63,162,77,28,63,121,108,28,63,77,139,28,63,31,170,28,63,237,200,28,63,185,231,28,63,131,6,29,63,74,37,29,63,14,68,29,63,207,98,29,63,142,129,29,63,74,160,29,63,3,191,29,63,186,221,29,63,110,252,29,63,31,27,30,63,205,57,30,63,121,88,30,63,34,119,30,63,200,149,30,63,107,180,30,63,12,211,30,63,170,241,30,63,69,16,31,63,221,46,31,63,114,77,31,63,5,108,31,63,148,138,31,63,33,169,31,63,171,199,31,63,50,230,31,63,182,4,32,63,56,35,32,63,182,65,32,63,50,96,32,63,170,126,32,63,32,157,32,63,147,187,32,63,3,218,32,63,112,248,32,63,218,22,33,63,65,53,33,63,165,83,33,63,6,114,33,63,100,144,33,63,191,174,33,63,23,205,33,63,108,235,33,63,190,9,34,63,13,40,34,63,89,70,34,63,162,100,34,63,232,130,34,63,43,161,34,63,107,191,34,63,167,221,34,63,225,251,34,63,24,26,35,63,75,56,35,63,123,86,35,63,168,116,35,63,211,146,35,63,249,176,35,63,29,207,35,63,62,237,35,63,91,11,36,63,118,41,36,63,141,71,36,63,161,101,36,63,177,131,36,63,191,161,36,63,201,191,36,63,208,221,36,63,212,251,36,63,213,25,37,63,210,55,37,63,204,85,37,63,195,115,37,63,183,145,37,63,167,175,37,63,148,205,37,63,126,235,37,63,101,9,38,63,72,39,38,63,40,69,38,63,4,99,38,63,221,128,38,63,179,158,38,63,134,188,38,63,85,218,38,63,33,248,38,63,233,21,39,63,174,51,39,63,112,81,39,63,46,111,39,63,233,140,39,63,160,170,39,63,84,200,39,63,4,230,39,63,178,3,40,63,91,33,40,63,1,63,40,63,164,92,40,63,67,122,40,63,223,151,40,63,120,181,40,63,12,211,40,63,158,240,40,63,43,14,41,63,182,43,41,63,60,73,41,63,192,102,41,63,63,132,41,63,187,161,41,63,52,191,41,63,169,220,41,63,26,250,41,63,136,23,42,63,242,52,42,63,89,82,42,63,188,111,42,63,28,141,42,63,119,170,42,63,208,199,42,63,36,229,42,63,117,2,43,63,194,31,43,63,12,61,43,63,82,90,43,63,148,119,43,63,211,148,43,63,14,178,43,63,69,207,43,63,120,236,43,63,168,9,44,63,212,38,44,63,252,67,44,63,33,97,44,63,66,126,44,63,95,155,44,63,120,184,44,63,142,213,44,63,159,242,44,63,173,15,45,63,184,44,45,63,190,73,45,63,193,102,45,63,191,131,45,63,186,160,45,63,177,189,45,63,165,218,45,63,148,247,45,63,128,20,46,63,103,49,46,63,75,78,46,63,43,107,46,63,7,136,46,63,224,164,46,63,180,193,46,63,132,222,46,63,81,251,46,63,26,24,47,63,222,52,47,63,159,81,47,63,92,110,47,63,21,139,47,63,202,167,47,63,123,196,47,63,40,225,47,63,209,253,47,63,118,26,48,63,23,55,48,63,180,83,48,63,77,112,48,63,226,140,48,63,115,169,48,63,0,198,48,63,137,226,48,63,14,255,48,63,142,27,49,63,11,56,49,63,132,84,49,63,248,112,49,63,105,141,49,63,214,169,49,63,62,198,49,63,162,226,49,63,2,255,49,63,95,27,50,63,182,55,50,63,10,84,50,63,90,112,50,63,166,140,50,63,237,168,50,63,48,197,50,63,111,225,50,63,170,253,50,63,225,25,51,63,19,54,51,63,66,82,51,63,108,110,51,63,146,138,51,63,180,166,51,63,209,194,51,63,234,222,51,63,0,251,51,63,16,23,52,63,29,51,52,63,37,79,52,63,41,107,52,63,41,135,52,63,37,163,52,63,28,191,52,63,15,219,52,63,253,246,52,63,232,18,53,63,206,46,53,63,176,74,53,63,141,102,53,63,102,130,53,63,59,158,53,63,11,186,53,63,215,213,53,63,159,241,53,63,98,13,54,63,33,41,54,63,220,68,54,63,146,96,54,63,68,124,54,63,241,151,54,63,154,179,54,63,63,207,54,63,223,234,54,63,123,6,55,63,18,34,55,63,165,61,55,63,52,89,55,63,190,116,55,63,67,144,55,63,196,171,55,63,65,199,55,63,185,226,55,63,45,254,55,63,156,25,56,63,7,53,56,63,109,80,56,63,207,107,56,63,44,135,56,63,133,162,56,63,217,189,56,63,40,217,56,63,115,244,56,63,186,15,57,63,252,42,57,63,57,70,57,63,114,97,57,63,166,124,57,63,214,151,57,63,1,179,57,63,40,206,57,63,74,233,57,63,103,4,58,63,128,31,58,63,148,58,58,63,163,85,58,63,174,112,58,63,180,139,58,63,182,166,58,63,179,193,58,63,171,220,58,63,159,247,58,63,142,18,59,63,120,45,59,63,94,72,59,63,63,99,59,63,27,126,59,63,243,152,59,63,197,179,59,63,148,206,59,63,93,233,59,63,34,4,60,63,226,30,60,63,157,57,60,63,84,84,60,63,5,111,60,63,178,137,60,63,91,164,60,63,254,190,60,63,157,217,60,63,55,244,60,63,204,14,61,63,93,41,61,63,232,67,61,63,111,94,61,63,241,120,61,63,110,147,61,63,231,173,61,63,91,200,61,63,201,226,61,63,51,253,61,63,152,23,62,63,249,49,62,63,84,76,62,63,171,102,62,63,252,128,62,63,73,155,62,63,145,181,62,63,212,207,62,63,19,234,62,63,76,4,63,63,128,30,63,63,176,56,63,63,219,82,63,63,0,109,63,63,33,135,63,63,61,161,63,63,84,187,63,63,102,213,63,63,115,239,63,63,123,9,64,63,127,35,64,63,125,61,64,63,118,87,64,63,106,113,64,63,90,139,64,63,68,165,64,63,42,191,64,63,10,217,64,63,229,242,64,63,188,12,65,63,141,38,65,63,90,64,65,63,33,90,65,63,228,115,65,63,161,141,65,63,89,167,65,63,13,193,65,63,187,218,65,63,100,244,65,63,8,14,66,63,167,39,66,63,65,65,66,63,214,90,66,63,102,116,66,63,241,141,66,63,119,167,66,63,248,192,66,63,115,218,66,63,234,243,66,63,91,13,67,63,199,38,67,63,47,64,67,63,145,89,67,63,238,114,67,63,69,140,67,63,152,165,67,63,230,190,67,63,46,216,67,63,113,241,67,63,175,10,68,63,232,35,68,63,28,61,68,63,75,86,68,63,116,111,68,63,153,136,68,63,184,161,68,63,210,186,68,63,230,211,68,63,246,236,68,63,0,6,69,63,5,31,69,63,5,56,69,63,0,81,69,63,245,105,69,63,230,130,69,63,209,155,69,63,182,180,69,63,151,205,69,63,114,230,69,63,72,255,69,63,25,24,70,63,229,48,70,63,171,73,70,63,108,98,70,63,40,123,70,63,222,147,70,63,143,172,70,63,59,197,70,63,226,221,70,63,131,246,70,63,31,15,71,63,182,39,71,63,71,64,71,63,211,88,71,63,90,113,71,63,220,137,71,63,88,162,71,63,207,186,71,63,64,211,71,63,172,235,71,63,19,4,72,63,116,28,72,63,209,52,72,63,39,77,72,63,121,101,72,63,197,125,72,63,11,150,72,63,77,174,72,63,137,198,72,63,191,222,72,63,240,246,72,63,28,15,73,63,66,39,73,63,99,63,73,63,127,87,73,63,149,111,73,63,166,135,73,63,177,159,73,63,183,183,73,63,183,207,73,63,178,231,73,63,168,255,73,63,152,23,74,63,131,47,74,63,104,71,74,63,72,95,74,63,34,119,74,63,247,142,74,63,199,166,74,63,145,190,74,63,85,214,74,63,20,238,74,63,206,5,75,63,130,29,75,63,49,53,75,63,218,76,75,63,126,100,75,63,28,124,75,63,181,147,75,63,72,171,75,63,213,194,75,63,93,218,75,63,224,241,75,63,93,9,76,63,213,32,76,63,71,56,76,63,179,79,76,63,26,103,76,63,124,126,76,63,216,149,76,63,46,173,76,63,127,196,76,63,202,219,76,63,16,243,76,63,80,10,77,63,139,33,77,63,192,56,77,63,240,79,77,63,26,103,77,63,62,126,77,63,93,149,77,63,118,172,77,63,137,195,77,63,151,218,77,63,160,241,77,63,163,8,78,63,160,31,78,63,151,54,78,63,137,77,78,63,118,100,78,63,93,123,78,63,62,146,78,63,25,169,78,63,239,191,78,63,192,214,78,63,138,237,78,63,79,4,79,63,15,27,79,63,201,49,79,63,125,72,79,63,43,95,79,63,212,117,79,63,119,140,79,63,21,163,79,63,172,185,79,63,63,208,79,63,203,230,79,63,82,253,79,63,211,19,80,63,79,42,80,63,197,64,80,63,53,87,80,63,159,109,80,63,4,132,80,63,99,154,80,63,189,176,80,63,16,199,80,63,94,221,80,63,167,243,80,63,233,9,81,63,38,32,81,63,93,54,81,63,143,76,81,63,187,98,81,63,225,120,81,63,1,143,81,63,28,165,81,63,48,187,81,63,64,209,81,63,73,231,81,63,77,253,81,63,75,19,82,63,67,41,82,63,53,63,82,63,34,85,82,63,9,107,82,63,234,128,82,63,198,150,82,63,155,172,82,63,107,194,82,63,53,216,82,63,250,237,82,63,185,3,83,63,113,25,83,63,37,47,83,63,210,68,83,63,121,90,83,63,27,112,83,63,183,133,83,63,77,155,83,63,222,176,83,63,104,198,83,63,237,219,83,63,108,241,83,63,230,6,84,63,89,28,84,63,199,49,84,63,46,71,84,63,145,92,84,63,237,113,84,63,67,135,84,63,148,156,84,63,223,177,84,63,35,199,84,63,99,220,84,63,156,241,84,63,207,6,85,63,253,27,85,63,37,49,85,63,71,70,85,63,99,91,85,63,121,112,85,63,138,133,85,63,149,154,85,63,153,175,85,63,152,196,85,63,146,217,85,63,133,238,85,63,114,3,86,63,90,24,86,63,60,45,86,63,24,66,86,63,238,86,86,63,190,107,86,63,136,128,86,63,76,149,86,63,11,170,86,63,196,190,86,63,118,211,86,63,35,232,86,63,203,252,86,63,108,17,87,63,7,38,87,63,156,58,87,63,44,79,87,63,182,99,87,63,58,120,87,63,183,140,87,63,47,161,87,63,162,181,87,63,14,202,87,63,116,222,87,63,213,242,87,63,47,7,88,63,132,27,88,63,211,47,88,63,28,68,88,63,95,88,88,63,156,108,88,63,211,128,88,63,4,149,88,63,47,169,88,63,85,189,88,63,116,209,88,63,142,229,88,63,162,249,88,63,175,13,89,63,183,33,89,63,185,53,89,63,181,73,89,63,171,93,89,63,155,113,89,63,134,133,89,63,106,153,89,63,72,173,89,63,33,193,89,63,243,212,89,63,192,232,89,63,135,252,89,63,71,16,90,63,2,36,90,63,183,55,90,63,102,75,90,63,15,95,90,63,178,114,90,63,79,134,90,63,230,153,90,63,119,173,90,63,3,193,90,63,136,212,90,63,7,232,90,63,129,251,90,63,244,14,91,63,98,34,91,63,201,53,91,63,43,73,91,63,135,92,91,63,220,111,91,63,44,131,91,63,118,150,91,63,186,169,91,63,248,188,91,63,47,208,91,63,97,227,91,63,141,246,91,63,179,9,92,63,212,28,92,63,238,47,92,63,2,67,92,63,16,86,92,63,24,105,92,63,26,124,92,63,23,143,92,63,13,162,92,63,253,180,92,63,232,199,92,63,204,218,92,63,171,237,92,63,131,0,93,63,86,19,93,63,34,38,93,63,233,56,93,63,169,75,93,63,100,94,93,63,24,113,93,63,199,131,93,63,112,150,93,63,18,169,93,63,175,187,93,63,70,206,93,63,215,224,93,63,97,243,93,63,230,5,94,63,101,24,94,63,222,42,94,63,81,61,94,63,190,79,94,63,36,98,94,63,133,116,94,63,224,134,94,63,53,153,94,63,132,171,94,63,205,189,94,63,16,208,94,63,77,226,94,63,132,244,94,63,181,6,95,63,224,24,95,63,5,43,95,63,36,61,95,63,61,79,95,63,80,97,95,63,93,115,95,63,101,133,95,63,102,151,95,63,97,169,95,63,86,187,95,63,69,205,95,63,46,223,95,63,18,241,95,63,239,2,96,63,198,20,96,63,151,38,96,63,98,56,96,63,40,74,96,63,231,91,96,63,160,109,96,63,84,127,96,63,1,145,96,63,168,162,96,63,73,180,96,63,229,197,96,63,122,215,96,63,10,233,96,63,147,250,96,63,22,12,97,63,148,29,97,63,11,47,97,63,125,64,97,63,232,81,97,63,77,99,97,63,173,116,97,63,6,134,97,63,90,151,97,63,167,168,97,63,239,185,97,63,48,203,97,63,108,220,97,63,162,237,97,63,209,254,97,63,251,15,98,63,30,33,98,63,60,50,98,63,84,67,98,63,101,84,98,63,113,101,98,63,119,118,98,63,119,135,98,63,112,152,98,63,100,169,98,63,82,186,98,63,58,203,98,63,28,220,98,63,247,236,98,63,205,253,98,63,157,14,99,63,103,31,99,63,43,48,99,63,233,64,99,63,161,81,99,63,83,98,99,63,255,114,99,63,165,131,99,63,69,148,99,63,224,164,99,63,116,181,99,63,2,198,99,63,138,214,99,63,13,231,99,63,137,247,99,63,255,7,100,63,112,24,100,63,218,40,100,63,62,57,100,63,157,73,100,63,246,89,100,63,72,106,100,63,149,122,100,63,219,138,100,63,28,155,100,63,87,171,100,63,140,187,100,63,186,203,100,63,227,219,100,63,6,236,100,63,35,252,100,63,58,12,101,63,75,28,101,63,86,44,101,63,91,60,101,63,91,76,101,63,84,92,101,63,71,108,101,63,53,124,101,63,28,140,101,63,254,155,101,63,217,171,101,63,175,187,101,63,126,203,101,63,72,219,101,63,12,235,101,63,202,250,101,63,130,10,102,63,52,26,102,63,224,41,102,63,134,57,102,63,38,73,102,63,193,88,102,63,85,104,102,63,227,119,102,63,108,135,102,63,238,150,102,63,107,166,102,63,226,181,102,63,83,197,102,63,190,212,102,63,35,228,102,63,130,243,102,63,219,2,103,63,46,18,103,63,124,33,103,63,195,48,103,63,5,64,103,63,64,79,103,63,118,94,103,63,166,109,103,63,208,124,103,63,244,139,103,63,18,155,103,63,42,170,103,63,61,185,103,63,73,200,103,63,80,215,103,63,80,230,103,63,75,245,103,63,64,4,104,63,47,19,104,63,24,34,104,63,251,48,104,63,217,63,104,63,176,78,104,63,130,93,104,63,78,108,104,63,20,123,104,63,212,137,104,63,142,152,104,63,66,167,104,63,240,181,104,63,153,196,104,63,60,211,104,63,217,225,104,63,112,240,104,63,1,255,104,63,140,13,105,63,17,28,105,63,145,42,105,63,11,57,105,63,127,71,105,63,237,85,105,63,85,100,105,63,183,114,105,63,20,129,105,63,106,143,105,63,187,157,105,63,6,172,105,63,75,186,105,63,139,200,105,63,196,214,105,63,248,228,105,63,38,243,105,63,78,1,106,63,112,15,106,63,141,29,106,63,163,43,106,63,180,57,106,63,191,71,106,63,196,85,106,63,196,99,106,63,189,113,106,63,177,127,106,63,159,141,106,63,135,155,106,63,106,169,106,63,70,183,106,63,29,197,106,63,238,210,106,63,186,224,106,63,127,238,106,63,63,252,106,63,249,9,107,63,173,23,107,63,91,37,107,63,4,51,107,63,167,64,107,63,68,78,107,63,219,91,107,63,109,105,107,63,249,118,107,63,127,132,107,63,255,145,107,63,122,159,107,63,238,172,107,63,94,186,107,63,199,199,107,63,42,213,107,63,136,226,107,63,224,239,107,63,51,253,107,63,128,10,108,63,198,23,108,63,8,37,108,63,67,50,108,63,121,63,108,63,169,76,108,63,211,89,108,63,248,102,108,63,23,116,108,63,48,129,108,63,68,142,108,63,82,155,108,63,90,168,108,63,92,181,108,63,89,194,108,63,80,207,108,63,65,220,108,63,45,233,108,63,19,246,108,63,243,2,109,63,206,15,109,63,163,28,109,63,114,41,109,63,60,54,109,63,0,67,109,63,190,79,109,63,119,92,109,63,42,105,109,63,215,117,109,63,127,130,109,63,33,143,109,63,189,155,109,63,84,168,109,63,229,180,109,63,113,193,109,63,247,205,109,63,119,218,109,63,242,230,109,63,103,243,109,63,214,255,109,63,64,12,110,63,164,24,110,63,3,37,110,63,91,49,110,63,175,61,110,63,253,73,110,63,69,86,110,63,135,98,110,63,196,110,110,63,252,122,110,63,45,135,110,63,90,147,110,63,128,159,110,63,161,171,110,63,189,183,110,63,211,195,110,63,227,207,110,63,238,219,110,63,243,231,110,63,243,243,110,63,237,255,110,63,226,11,111,63,209,23,111,63,186,35,111,63,158,47,111,63,125,59,111,63,85,71,111,63,41,83,111,63,247,94,111,63,191,106,111,63,130,118,111,63,63,130,111,63,247,141,111,63,169,153,111,63,86,165,111,63,253,176,111,63,159,188,111,63,59,200,111,63,210,211,111,63,99,223,111,63,239,234,111,63,117,246,111,63,246,1,112,63,114,13,112,63,231,24,112,63,88,36,112,63,195,47,112,63,40,59,112,63,137,70,112,63,227,81,112,63,56,93,112,63,136,104,112,63,210,115,112,63,23,127,112,63,87,138,112,63,145,149,112,63,197,160,112,63,244,171,112,63,30,183,112,63,66,194,112,63,97,205,112,63,123,216,112,63,143,227,112,63,157,238,112,63,167,249,112,63,171,4,113,63,169,15,113,63,162,26,113,63,150,37,113,63,132,48,113,63,109,59,113,63,81,70,113,63,47,81,113,63,8,92,113,63,219,102,113,63,170,113,113,63,114,124,113,63,54,135,113,63,244,145,113,63,173,156,113,63,96,167,113,63,14,178,113,63,183,188,113,63,91,199,113,63,249,209,113,63,146,220,113,63,37,231,113,63,179,241,113,63,60,252,113,63,192,6,114,63,62,17,114,63,183,27,114,63,43,38,114,63,154,48,114,63,3,59,114,63,103,69,114,63,197,79,114,63,31,90,114,63,115,100,114,63,194,110,114,63,11,121,114,63,79,131,114,63,143,141,114,63,200,151,114,63,253,161,114,63,44,172,114,63,87,182,114,63,123,192,114,63,155,202,114,63,182,212,114,63,203,222,114,63,219,232,114,63,230,242,114,63,235,252,114,63,236,6,115,63,231,16,115,63,221,26,115,63,206,36,115,63,186,46,115,63,160,56,115,63,130,66,115,63,94,76,115,63,53,86,115,63,7,96,115,63,212,105,115,63,155,115,115,63,94,125,115,63,27,135,115,63,211,144,115,63,134,154,115,63,52,164,115,63,221,173,115,63,128,183,115,63,31,193,115,63,184,202,115,63,77,212,115,63,220,221,115,63,102,231,115,63,235,240,115,63,107,250,115,63,230,3,116,63,92,13,116,63,204,22,116,63,56,32,116,63,159,41,116,63,0,51,116,63,93,60,116,63,180,69,116,63,6,79,116,63,84,88,116,63,156,97,116,63,223,106,116,63,29,116,116,63,87,125,116,63,139,134,116,63,186,143,116,63,228,152,116,63,9,162,116,63,41,171,116,63,68,180,116,63,91,189,116,63,108,198,116,63,120,207,116,63,127,216,116,63,129,225,116,63,127,234,116,63,119,243,116,63,106,252,116,63,89,5,117,63,66,14,117,63,38,23,117,63,6,32,117,63,225,40,117,63,182,49,117,63,135,58,117,63,83,67,117,63,26,76,117,63,220,84,117,63,153,93,117,63,81,102,117,63,4,111,117,63,179,119,117,63,92,128,117,63,1,137,117,63,160,145,117,63,59,154,117,63,209,162,117,63,98,171,117,63,239,179,117,63,118,188,117,63,249,196,117,63,118,205,117,63,239,213,117,63,99,222,117,63,210,230,117,63,61,239,117,63,162,247,117,63,3,0,118,63,95,8,118,63,182,16,118,63,8,25,118,63,86,33,118,63,159,41,118,63,227,49,118,63,34,58,118,63,92,66,118,63,146,74,118,63,195,82,118,63,239,90,118,63,22,99,118,63,57,107,118,63,86,115,118,63,112,123,118,63,132,131,118,63,148,139,118,63,158,147,118,63,165,155,118,63,166,163,118,63,163,171,118,63,155,179,118,63,142,187,118,63,125,195,118,63,103,203,118,63,76,211,118,63,45,219,118,63,9,227,118,63,224,234,118,63,178,242,118,63,128,250,118,63,74,2,119,63,14,10,119,63,206,17,119,63,137,25,119,63,64,33,119,63,242,40,119,63,160,48,119,63,72,56,119,63,237,63,119,63,140,71,119,63,39,79,119,63,190,86,119,63,79,94,119,63,220,101,119,63,101,109,119,63,233,116,119,63,105,124,119,63,228,131,119,63,90,139,119,63,204,146,119,63,57,154,119,63,162,161,119,63,6,169,119,63,101,176,119,63,192,183,119,63,23,191,119,63,105,198,119,63,182,205,119,63,255,212,119,63,68,220,119,63,132,227,119,63,191,234,119,63,246,241,119,63,41,249,119,63,87,0,120,63,129,7,120,63,166,14,120,63,198,21,120,63,227,28,120,63,250,35,120,63,14,43,120,63,28,50,120,63,39,57,120,63,45,64,120,63,46,71,120,63,44,78,120,63,36,85,120,63,25,92,120,63,9,99,120,63,244,105,120,63,219,112,120,63,190,119,120,63,156,126,120,63,118,133,120,63,76,140,120,63,29,147,120,63,234,153,120,63,179,160,120,63,119,167,120,63,55,174,120,63,242,180,120,63,169,187,120,63,92,194,120,63,11,201,120,63,181,207,120,63,91,214,120,63,252,220,120,63,154,227,120,63,51,234,120,63,199,240,120,63,88,247,120,63,228,253,120,63,108,4,121,63,240,10,121,63,111,17,121,63,234,23,121,63,97,30,121,63,211,36,121,63,66,43,121,63,172,49,121,63,18,56,121,63,116,62,121,63,209,68,121,63,42,75,121,63,127,81,121,63,208,87,121,63,29,94,121,63,101,100,121,63,170,106,121,63,234,112,121,63,38,119,121,63,93,125,121,63,145,131,121,63,193,137,121,63,236,143,121,63,19,150,121,63,54,156,121,63,85,162,121,63,112,168,121,63,134,174,121,63,153,180,121,63,167,186,121,63,178,192,121,63,184,198,121,63,186,204,121,63,184,210,121,63,178,216,121,63,168,222,121,63,154,228,121,63,135,234,121,63,113,240,121,63,87,246,121,63,56,252,121,63,22,2,122,63,239,7,122,63,197,13,122,63,150,19,122,63,100,25,122,63,45,31,122,63,243,36,122,63,180,42,122,63,113,48,122,63,43,54,122,63,224,59,122,63,146,65,122,63,63,71,122,63,233,76,122,63,142,82,122,63,48,88,122,63,206,93,122,63,103,99,122,63,253,104,122,63,143,110,122,63,29,116,122,63,167,121,122,63,45,127,122,63,175,132,122,63,45,138,122,63,168,143,122,63,30,149,122,63,145,154,122,63,255,159,122,63,106,165,122,63,209,170,122,63,52,176,122,63,147,181,122,63,239,186,122,63,70,192,122,63,154,197,122,63,234,202,122,63,54,208,122,63,126,213,122,63,194,218,122,63,3,224,122,63,64,229,122,63,121,234,122,63,174,239,122,63,223,244,122,63,13,250,122,63,55,255,122,63,93,4,123,63,127,9,123,63,157,14,123,63,184,19,123,63,207,24,123,63,227,29,123,63,242,34,123,63,254,39,123,63,6,45,123,63,10,50,123,63,11,55,123,63,8,60,123,63,1,65,123,63,247,69,123,63,233,74,123,63,215,79,123,63,193,84,123,63,168,89,123,63,139,94,123,63,107,99,123,63,71,104,123,63,31,109,123,63,243,113,123,63,196,118,123,63,146,123,123,63,91,128,123,63,33,133,123,63,228,137,123,63,163,142,123,63,94,147,123,63,22,152,123,63,202,156,123,63,122,161,123,63,39,166,123,63,208,170,123,63,118,175,123,63,24,180,123,63,183,184,123,63,82,189,123,63,233,193,123,63,125,198,123,63,14,203,123,63,155,207,123,63,36,212,123,63,170,216,123,63,45,221,123,63,172,225,123,63,39,230,123,63,159,234,123,63,19,239,123,63,132,243,123,63,242,247,123,63,92,252,123,63,195,0,124,63,38,5,124,63,133,9,124,63,226,13,124,63,58,18,124,63,144,22,124,63,226,26,124,63,48,31,124,63,123,35,124,63,195,39,124,63,7,44,124,63,72,48,124,63,134,52,124,63,192,56,124,63,247,60,124,63,42,65,124,63,90,69,124,63,135,73,124,63,176,77,124,63,214,81,124,63,249,85,124,63,24,90,124,63,52,94,124,63,77,98,124,63,98,102,124,63,116,106,124,63,131,110,124,63,142,114,124,63,150,118,124,63,155,122,124,63,157,126,124,63,155,130,124,63,150,134,124,63,142,138,124,63,130,142,124,63,116,146,124,63,98,150,124,63,77,154,124,63,52,158,124,63,24,162,124,63,249,165,124,63,215,169,124,63,178,173,124,63,137,177,124,63,94,181,124,63,47,185,124,63,253,188,124,63,199,192,124,63,143,196,124,63,83,200,124,63,20,204,124,63,211,207,124,63,141,211,124,63,69,215,124,63,250,218,124,63,171,222,124,63,90,226,124,63,5,230,124,63,173,233,124,63,82,237,124,63,244,240,124,63,147,244,124,63,46,248,124,63,199,251,124,63,93,255,124,63,239,2,125,63,127,6,125,63,11,10,125,63,148,13,125,63,27,17,125,63,158,20,125,63,30,24,125,63,155,27,125,63,21,31,125,63,140,34,125,63,0,38,125,63,114,41,125,63,224,44,125,63,75,48,125,63,179,51,125,63,24,55,125,63,122,58,125,63,217,61,125,63,54,65,125,63,143,68,125,63,229,71,125,63,56,75,125,63,137,78,125,63,214,81,125,63,33,85,125,63,104,88,125,63,173,91,125,63,239,94,125,63,46,98,125,63,106,101,125,63,163,104,125,63,217,107,125,63,12,111,125,63,61,114,125,63,106,117,125,63,149,120,125,63,189,123,125,63,226,126,125,63,4,130,125,63,36,133,125,63,64,136,125,63,90,139,125,63,112,142,125,63,133,145,125,63,150,148,125,63,164,151,125,63,176,154,125,63,185,157,125,63,191,160,125,63,194,163,125,63,194,166,125,63,192,169,125,63,187,172,125,63,179,175,125,63,168,178,125,63,155,181,125,63,139,184,125,63,120,187,125,63,99,190,125,63,74,193,125,63,48,196,125,63,18,199,125,63,241,201,125,63,206,204,125,63,169,207,125,63,128,210,125,63,85,213,125,63,39,216,125,63,247,218,125,63,196,221,125,63,142,224,125,63,85,227,125,63,26,230,125,63,220,232,125,63,156,235,125,63,89,238,125,63,19,241,125,63,203,243,125,63,128,246,125,63,51,249,125,63,227,251,125,63,144,254,125,63,59,1,126,63,227,3,126,63,137,6,126,63,44,9,126,63,204,11,126,63,106,14,126,63,6,17,126,63,158,19,126,63,53,22,126,63,200,24,126,63,90,27,126,63,232,29,126,63,116,32,126,63,254,34,126,63,133,37,126,63,10,40,126,63,140,42,126,63,12,45,126,63,137,47,126,63,4,50,126,63,124,52,126,63,242,54,126,63,101,57,126,63,214,59,126,63,68,62,126,63,176,64,126,63,26,67,126,63,129,69,126,63,230,71,126,63,72,74,126,63,168,76,126,63,5,79,126,63,96,81,126,63,185,83,126,63,15,86,126,63,99,88,126,63,181,90,126,63,4,93,126,63,81,95,126,63,155,97,126,63,227,99,126,63,41,102,126,63,108,104,126,63,173,106,126,63,236,108,126,63,40,111,126,63,98,113,126,63,154,115,126,63,208,117,126,63,3,120,126,63,51,122,126,63,98,124,126,63,142,126,126,63,184,128,126,63,224,130,126,63,5,133,126,63,40,135,126,63,73,137,126,63,104,139,126,63,132,141,126,63,159,143,126,63,183,145,126,63,204,147,126,63,224,149,126,63,241,151,126,63,0,154,126,63,13,156,126,63,24,158,126,63,32,160,126,63,38,162,126,63,42,164,126,63,44,166,126,63,44,168,126,63,41,170,126,63,37,172,126,63,30,174,126,63,21,176,126,63,10,178,126,63,253,179,126,63,238,181,126,63,220,183,126,63,201,185,126,63,179,187,126,63,155,189,126,63,129,191,126,63,101,193,126,63,71,195,126,63,39,197,126,63,5,199,126,63,224,200,126,63,186,202,126,63,145,204,126,63,103,206,126,63,58,208,126,63,12,210,126,63,219,211,126,63,168,213,126,63,115,215,126,63,61,217,126,63,4,219,126,63,201,220,126,63,140,222,126,63,77,224,126,63,12,226,126,63,202,227,126,63,133,229,126,63,62,231,126,63,245,232,126,63,170,234,126,63,94,236,126,63,15,238,126,63,190,239,126,63,108,241,126,63,23,243,126,63,193,244,126,63,104,246,126,63,14,248,126,63,178,249,126,63,84,251,126,63,243,252,126,63,145,254,126,63,46,0,127,63,200,1,127,63,96,3,127,63,247,4,127,63,139,6,127,63,30,8,127,63,175,9,127,63,62,11,127,63,203,12,127,63,86,14,127,63,223,15,127,63,103,17,127,63,237,18,127,63,112,20,127,63,242,21,127,63,115,23,127,63,241,24,127,63,110,26,127,63,233,27,127,63,98,29,127,63,217,30,127,63,78,32,127,63,194,33,127,63,52,35,127,63,164,36,127,63,18,38,127,63,127,39,127,63,234,40,127,63,83,42,127,63,186,43,127,63,32,45,127,63,131,46,127,63,230,47,127,63,70,49,127,63,165,50,127,63,2,52,127,63,93,53,127,63,182,54,127,63,14,56,127,63,100,57,127,63,185,58,127,63,12,60,127,63,93,61,127,63,172,62,127,63,250,63,127,63,70,65,127,63,145,66,127,63,217,67,127,63,33,69,127,63,102,70,127,63,170,71,127,63,236,72,127,63,45,74,127,63,108,75,127,63,169,76,127,63,229,77,127,63,31,79,127,63,88,80,127,63,143,81,127,63,196,82,127,63,248,83,127,63,42,85,127,63,91,86,127,63,138,87,127,63,184,88,127,63,228,89,127,63,14,91,127,63,55,92,127,63,94,93,127,63,132,94,127,63,169,95,127,63,203,96,127,63,237,97,127,63,12,99,127,63,42,100,127,63,71,101,127,63,98,102,127,63,124,103,127,63,148,104,127,63,171,105,127,63,192,106,127,63,212,107,127,63,230,108,127,63,247,109,127,63,6,111,127,63,20,112,127,63,33,113,127,63,44,114,127,63,53,115,127,63,61,116,127,63,68,117,127,63,73,118,127,63,77,119,127,63,79,120,127,63,80,121,127,63,80,122,127,63,78,123,127,63,75,124,127,63,70,125,127,63,64,126,127,63,57,127,127,63,48,128,127,63,38,129,127,63,27,130,127,63,14,131,127,63,0,132,127,63,240,132,127,63,223,133,127,63,205,134,127,63,185,135,127,63,164,136,127,63,142,137,127,63,118,138,127,63,93,139,127,63,67,140,127,63,40,141,127,63,11,142,127,63,237,142,127,63,205,143,127,63,173,144,127,63,139,145,127,63,103,146,127,63,67,147,127,63,29,148,127,63,246,148,127,63,205,149,127,63,164,150,127,63,121,151,127,63,77,152,127,63,31,153,127,63,241,153,127,63,193,154,127,63,144,155,127,63,93,156,127,63,42,157,127,63,245,157,127,63,191,158,127,63,136,159,127,63,79,160,127,63,22,161,127,63,219,161,127,63,159,162,127,63,98,163,127,63,36,164,127,63,228,164,127,63,163,165,127,63,98,166,127,63,31,167,127,63,219,167,127,63,149,168,127,63,79,169,127,63,7,170,127,63,190,170,127,63,117,171,127,63,42,172,127,63,221,172,127,63,144,173,127,63,66,174,127,63,242,174,127,63,162,175,127,63,80,176,127,63,253,176,127,63,169,177,127,63,85,178,127,63,254,178,127,63,167,179,127,63,79,180,127,63,246,180,127,63,156,181,127,63,64,182,127,63,228,182,127,63,134,183,127,63,40,184,127,63,200,184,127,63,103,185,127,63,6,186,127,63,163,186,127,63,63,187,127,63,219,187,127,63,117,188,127,63,14,189,127,63,166,189,127,63,61,190,127,63,212,190,127,63,105,191,127,63,253,191,127,63,144,192,127,63,34,193,127,63,180,193,127,63,68,194,127,63,211,194,127,63,98,195,127,63,239,195,127,63,123,196,127,63,7,197,127,63,145,197,127,63,27,198,127,63,163,198,127,63,43,199,127,63,178,199,127,63,56,200,127,63,189,200,127,63,65,201,127,63,196,201,127,63,70,202,127,63,199,202,127,63,71,203,127,63,199,203,127,63,69,204,127,63,195,204,127,63,64,205,127,63,187,205,127,63,54,206,127,63,177,206,127,63,42,207,127,63,162,207,127,63,26,208,127,63,144,208,127,63,6,209,127,63,123,209,127,63,239,209,127,63,98,210,127,63,213,210,127,63,70,211,127,63,183,211,127,63,39,212,127,63,150,212,127,63,4,213,127,63,114,213,127,63,222,213,127,63,74,214,127,63,181,214,127,63,32,215,127,63,137,215,127,63,242,215,127,63,89,216,127,63,192,216,127,63,39,217,127,63,140,217,127,63,241,217,127,63,85,218,127,63,184,218,127,63,27,219,127,63,124,219,127,63,221,219,127,63,61,220,127,63,157,220,127,63,251,220,127,63,89,221,127,63,183,221,127,63,19,222,127,63,111,222,127,63,202,222,127,63,36,223,127,63,126,223,127,63,215,223,127,63,47,224,127,63,134,224,127,63,221,224,127,63,51,225,127,63,137,225,127,63,221,225,127,63,49,226,127,63,133,226,127,63,215,226,127,63,41,227,127,63,122,227,127,63,203,227,127,63,27,228,127,63,106,228,127,63,185,228,127,63,7,229,127,63,84,229,127,63,161,229,127,63,237,229,127,63,56,230,127,63,131,230,127,63,205,230,127,63,23,231,127,63,96,231,127,63,168,231,127,63,239,231,127,63,54,232,127,63,125,232,127,63,195,232,127,63,8,233,127,63,76,233,127,63,144,233,127,63,212,233,127,63,23,234,127,63,89,234,127,63,154,234,127,63,219,234,127,63,28,235,127,63,92,235,127,63,155,235,127,63,218,235,127,63,24,236,127,63,86,236,127,63,147,236,127,63,207,236,127,63,11,237,127,63,71,237,127,63,130,237,127,63,188,237,127,63,246,237,127,63,47,238,127,63,104,238,127,63,160,238,127,63,216,238,127,63,15,239,127,63,69,239,127,63,123,239,127,63,177,239,127,63,230,239,127,63,27,240,127,63,79,240,127,63,130,240,127,63,182,240,127,63,232,240,127,63,26,241,127,63,76,241,127,63,125,241,127,63,174,241,127,63,222,241,127,63,14,242,127,63,61,242,127,63,108,242,127,63,154,242,127,63,200,242,127,63,245,242,127,63,34,243,127,63,79,243,127,63,123,243,127,63,166,243,127,63,209,243,127,63,252,243,127,63,38,244,127,63,80,244,127,63,121,244,127,63,162,244,127,63,203,244,127,63,243,244,127,63,27,245,127,63,66,245,127,63,105,245,127,63,143,245,127,63,181,245,127,63,219,245,127,63,0,246,127,63,37,246,127,63,73,246,127,63,109,246,127,63,145,246,127,63,180,246,127,63,215,246,127,63,250,246,127,63,28,247,127,63,62,247,127,63,95,247,127,63,128,247,127,63,160,247,127,63,193,247,127,63,225,247,127,63,0,248,127,63,31,248,127,63,62,248,127,63,93,248,127,63,123,248,127,63,152,248,127,63,182,248,127,63,211,248,127,63,240,248,127,63,12,249,127,63,40,249,127,63,68,249,127,63,95,249,127,63,122,249,127,63,149,249,127,63,175,249,127,63,202,249,127,63,227,249,127,63,253,249,127,63,22,250,127,63,47,250,127,63,71,250,127,63,96,250,127,63,120,250,127,63,143,250,127,63,166,250,127,63,190,250,127,63,212,250,127,63,235,250,127,63,1,251,127,63,23,251,127,63,44,251,127,63,66,251,127,63,87,251,127,63,108,251,127,63,128,251,127,63,148,251,127,63,168,251,127,63,188,251,127,63,208,251,127,63,227,251,127,63,246,251,127,63,8,252,127,63,27,252,127,63,45,252,127,63,63,252,127,63,81,252,127,63,98,252,127,63,115,252,127,63,132,252,127,63,149,252,127,63,165,252,127,63,182,252,127,63,198,252,127,63,213,252,127,63,229,252,127,63,244,252,127,63,3,253,127,63,18,253,127,63,33,253,127,63,47,253,127,63,62,253,127,63,76,253,127,63,89,253,127,63,103,253,127,63,116,253,127,63,130,253,127,63,143,253,127,63,155,253,127,63,168,253,127,63,181,253,127,63,193,253,127,63,205,253,127,63,217,253,127,63,228,253,127,63,240,253,127,63,251,253,127,63,6,254,127,63,17,254,127,63,28,254,127,63,38,254,127,63,49,254,127,63,59,254,127,63,69,254,127,63,79,254,127,63,89,254,127,63,98,254,127,63,108,254,127,63,117,254,127,63,126,254,127,63,135,254,127,63,144,254,127,63,152,254,127,63,161,254,127,63,169,254,127,63,177,254,127,63,185,254,127,63,193,254,127,63,201,254,127,63,208,254,127,63,216,254,127,63,223,254,127,63,230,254,127,63,237,254,127,63,244,254,127,63,251,254,127,63,2,255,127,63,8,255,127,63,14,255,127,63,21,255,127,63,27,255,127,63,33,255,127,63,39,255,127,63,45,255,127,63,50,255,127,63,56,255,127,63,61,255,127,63,67,255,127,63,72,255,127,63,77,255,127,63,82,255,127,63,87,255,127,63,92,255,127,63,96,255,127,63,101,255,127,63,105,255,127,63,110,255,127,63,114,255,127,63,118,255,127,63,122,255,127,63,126,255,127,63,130,255,127,63,134,255,127,63,138,255,127,63,142,255,127,63,145,255,127,63,149,255,127,63,152,255,127,63,155,255,127,63,159,255,127,63,162,255,127,63,165,255,127,63,168,255,127,63,171,255,127,63,174,255,127,63,176,255,127,63,179,255,127,63,182,255,127,63,184,255,127,63,187,255,127,63,189,255,127,63,192,255,127,63,194,255,127,63,196,255,127,63,198,255,127,63,201,255,127,63,203,255,127,63,205,255,127,63,207,255,127,63,209,255,127,63,210,255,127,63,212,255,127,63,214,255,127,63,216,255,127,63,217,255,127,63,219,255,127,63,220,255,127,63,222,255,127,63,223,255,127,63,225,255,127,63,226,255,127,63,227,255,127,63,229,255,127,63,230,255,127,63,231,255,127,63,232,255,127,63,233,255,127,63,234,255,127,63,235,255,127,63,236,255,127,63,237,255,127,63,238,255,127,63,239,255,127,63,240,255,127,63,241,255,127,63,241,255,127,63,242,255,127,63,243,255,127,63,244,255,127,63,244,255,127,63,245,255,127,63,246,255,127,63,246,255,127,63,247,255,127,63,247,255,127,63,248,255,127,63,248,255,127,63,249,255,127,63,249,255,127,63,250,255,127,63,250,255,127,63,250,255,127,63,251,255,127,63,251,255,127,63,251,255,127,63,252,255,127,63,252,255,127,63,252,255,127,63,253,255,127,63,253,255,127,63,253,255,127,63,253,255,127,63,254,255,127,63,254,255,127,63,254,255,127,63,254,255,127,63,254,255,127,63,254,255,127,63,255,255,127,63,255,255,127,63,255,255,127,63,255,255,127,63,255,255,127,63,255,255,127,63,255,255,127,63,255,255,127,63,255,255,127,63,255,255,127,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,128,63,0,0,0,0,3,0,0,0,4,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,1,0,0,0,0,0,0,0,2,0,0,0,6,0,0,0,7,0,0,0,5,0,0,0,6,0,0,0,8,0,0,0,2,0,0,0,0,0,0,0,62,180,228,51,9,145,243,51,139,178,1,52,60,32,10,52,35,26,19,52,96,169,28,52,167,215,38,52,75,175,49,52,80,59,61,52,112,135,73,52,35,160,86,52,184,146,100,52,85,109,115,52,136,159,129,52,252,11,138,52,147,4,147,52,105,146,156,52,50,191,166,52,63,149,177,52,147,31,189,52,228,105,201,52,173,128,214,52,54,113,228,52,166,73,243,52,136,140,1,53,192,247,9,53,6,239,18,53,118,123,28,53,192,166,38,53,55,123,49,53,218,3,61,53,94,76,73,53,59,97,86,53,185,79,100,53,252,37,115,53,138,121,129,53,134,227,137,53,124,217,146,53,133,100,156,53,82,142,166,53,51,97,177,53,37,232,188,53,220,46,201,53,206,65,214,53,65,46,228,53,87,2,243,53,143,102,1,54,79,207,9,54,245,195,18,54,152,77,28,54,232,117,38,54,50,71,49,54,116,204,60,54,94,17,73,54,101,34,86,54,206,12,100,54,184,222,114,54,151,83,129,54,28,187,137,54,114,174,146,54,175,54,156,54,129,93,166,54,53,45,177,54,199,176,188,54,228,243,200,54,1,3,214,54,96,235,227,54,30,187,242,54,162,64,1,55,235,166,9,55,241,152,18,55,201,31,28,55,30,69,38,55,61,19,49,55,30,149,60,55,111,214,72,55,162,227,85,55,247,201,99,55,137,151,114,55,175,45,129,55,190,146,137,55,116,131,146,55,230,8,156,55,190,44,166,55,71,249,176,55,121,121,188,55,254,184,200,55,71,196,213,55,146,168,227,55,248,115,242,55,192,26,1,56,147,126,9,56,249,109,18,56,6,242,27,56,98,20,38,56,86,223,48,56,216,93,60,56,146,155,72,56,242,164,85,56,51,135,99,56,110,80,114,56,211,7,129,56,107,106,137,56,130,88,146,56,42,219,155,56,9,252,165,56,104,197,176,56,59,66,188,56,41,126,200,56,160,133,213,56,217,101,227,56,232,44,242,56,233,244,0,57,70,86,9,57,14,67,18,57,81,196,27,57,181,227,37,57,127,171,48,57,162,38,60,57,197,96,72,57,83,102,85,57,131,68,99,57,104,9,114,57,1,226,128,57,36,66,137,57,157,45,146,57,123,173,155,57,99,203,165,57,153,145,176,57,13,11,188,57], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+51200);
/* memory initializer */ allocate([102,67,200,57,11,71,213,57,50,35,227,57,237,229,241,57,29,207,0,58,5,46,9,58,48,24,18,58,169,150,27,58,21,179,37,58,183,119,48,58,124,239,59,58,10,38,72,58,199,39,85,58,230,1,99,58,120,194,113,58,59,188,128,58,233,25,137,58,198,2,146,58,219,127,155,58,203,154,165,58,216,93,176,58,239,211,187,58,179,8,200,58,136,8,213,58,159,224,226,58,7,159,241,58,92,169,0,59,208,5,9,59,94,237,17,59,15,105,27,59,132,130,37,59,253,67,48,59,103,184,59,59,97,235,71,59,77,233,84,59,93,191,98,59,156,123,113,59,127,150,128,59,186,241,136,59,249,215,145,59,71,82,155,59,65,106,165,59,39,42,176,59,226,156,187,59,18,206,199,59,23,202,212,59,32,158,226,59,53,88,241,59,166,131,0,60,167,221,8,60,152,194,17,60,130,59,27,60,1,82,37,60,84,16,48,60,97,129,59,60,200,176,71,60,229,170,84,60,232,124,98,60,212,52,113,60,207,112,128,60,150,201,136,60,58,173,145,60,192,36,155,60,197,57,165,60,133,246,175,60,229,101,187,60,130,147,199,60,185,139,212,60,180,91,226,60,121,17,241,60,251,93,0,61,137,181,8,61,223,151,17,61,2,14,27,61,141,33,37,61,185,220,47,61,109,74,59,61,64,118,71,61,145,108,84,61,133,58,98,61,34,238,112,61,42,75,128,61,127,161,136,61,136,130,145,61,72,247,154,61,88,9,165,61,242,194,175,61,248,46,187,61,3,89,199,61,109,77,212,61,92,25,226,61,209,202,240,61,91,56,0,62,119,141,8,62,51,109,17,62,144,224,26,62,39,241,36,62,46,169,47,62,135,19,59,62,202,59,71,62,77,46,84,62,55,248,97,62,132,167,112,62,143,37,128,62,115,121,136,62,226,87,145,62,220,201,154,62,249,216,164,62,109,143,175,62,27,248,186,62,149,30,199,62,51,15,212,62,23,215,225,62,61,132,240,62,198,18,0,63,114,101,8,63,147,66,17,63,43,179,26,63,206,192,36,63,177,117,47,63,178,220,58,63,101,1,71,63,29,240,83,63,251,181,97,63,251,96,112,63,0,0,128,63,1,0,0,0,9,0,0,0,7,0,0,0,1,0,0,0,10,0,0,0,0,0,0,0,116,104,101,111,114,97,0,0,24,32,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,160,1,0,0,144,1,0,0,160,2,0,0,144,2,0,0,160,4,0,0,144,4,0,0,160,8,0,0,160,40,0,0,144,8,0,0,144,40,10,0,32,0,10,0,224,255,0,0,240,255,0,1,0,0,0,2,0,0,0,3,0,0,1,0,32,0,1,0,224,255,2,0,32,0,2,0,224,255,3,0,32,0,3,0,224,255,4,0,32,0,4,0,224,255,5,0,32,0,5,0,224,255,1,0,64,0,1,0,96,0,1,0,192,255,1,0,160,255,6,0,32,0,7,0,32,0,8,0,32,0,9,0,32,0,6,0,224,255,7,0,224,255,8,0,224,255,9,0,224,255,2,0,64,0,3,0,64,0,2,0,96,0,3,0,96,0,2,0,192,255,3,0,192,255,2,0,160,255,3,0,160,255,0,0,240,255,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,0,0,0,32,0,0,0,224,255,0,0,64,0,0,0,192,255,0,0,96,0,0,0,160,255,0,0,128,0,0,0,128,255,0,0,160,0,0,0,96,255,0,0,192,0,0,0,64,255,0,0,224,0,0,0,0,1,0,0,32,255,0,0,0,255,0,0,32,1,0,0,64,1,0,0,96,1,0,0,128,1,0,0,224,254,0,0,192,254,0,0,160,254,0,0,128,254,0,8,0,0,0,9,0,0,0,10,0,0,0,11,0,0,0,12,0,0,0,13,0,0,0,14,0,0,0,15,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,7,0,0,1,6,15,28,64,0,0,0,12,4,3,3,4,4,5,5,8,8,8,8,3,3,6,0,4,0,255,254,255,254,255,254,255,254,255,254,255,254,255,254,255,254,254,252,254,252,253,252,253,252,252,251,251,251,224,251,17,0,2,0,220,253,216,253,180,253,36,253,0,0,0,0,6,0,224,249,224,249,223,249,225,249,222,249,226,249,221,249,227,249,220,249,228,249,219,249,229,249,218,249,230,249,217,249,231,249,216,249,232,249,215,249,233,249,214,249,234,249,213,249,235,249,212,249,236,249,211,249,237,249,210,249,238,249,209,249,239,249,208,249,240,249,207,249,241,249,206,249,242,249,205,249,243,249,204,249,244,249,203,249,245,249,202,249,246,249,201,249,247,249,200,249,248,249,199,249,249,249,198,249,250,249,197,249,251,249,196,249,252,249,195,249,253,249,194,249,254,249,193,249,255,249,0,0,0,0,0,0,5,0,224,252,224,252,224,252,224,252,223,252,223,252,223,252,223,252,225,252,225,252,225,252,225,252,222,251,222,251,226,251,226,251,221,251,221,251,227,251,227,251,33,0,36,0,39,0,42,0,45,0,50,0,55,0,60,0,65,0,74,0,83,0,92,0,1,0,220,254,228,254,1,0,219,254,229,254,1,0,218,254,230,254,1,0,217,254,231,254,2,0,216,253,232,253,215,253,233,253,2,0,214,253,234,253,213,253,235,253,2,0,212,253,236,253,211,253,237,253,2,0,210,253,238,253,209,253,239,253,3,0,208,252,240,252,207,252,241,252,206,252,242,252,205,252,243,252,3,0,204,252,244,252,203,252,245,252,202,252,246,252,201,252,247,252,3,0,200,252,248,252,199,252,249,252,198,252,250,252,197,252,251,252,3,0,196,252,252,252,195,252,253,252,194,252,254,252,193,252,255,252,0,0,0,0,0,0,3,4,2,0,1,5,6,7,3,4,0,2,1,5,6,7,3,2,4,0,1,5,6,7,3,2,0,4,1,5,6,7,0,3,4,2,1,5,6,7,0,5,3,4,2,1,6,7,0,1,2,3,4,5,6,7,3,0,0,253,255,252,254,252,253,252,252,252,251,252,250,252,249,252,0,0,0,0,0,0,4,0,0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,255,255,253,255,253,255,253,255,253,254,252,254,252,253,251,17,0,3,0,252,254,252,254,252,254,252,254,251,253,251,253,250,252,249,252,0,0,0,0,5,0,255,253,255,253,255,253,255,253,255,253,255,253,255,253,255,253,254,253,254,253,254,253,254,253,254,253,254,253,254,253,254,253,253,252,253,252,253,252,253,252,252,252,252,252,252,252,252,252,251,251,251,251,250,251,250,251,33,0,36,0,39,0,44,0,1,0,249,254,248,254,1,0,247,254,246,254,2,0,245,253,244,253,243,253,242,253,4,0,241,251,240,251,239,251,238,251,237,251,236,251,235,251,234,251,233,251,232,251,231,251,230,251,229,251,228,251,227,251,226,251,0,0,0,0,0,0,0,0,0,2,3,0,0,3,0,0,0,0,0,1,1,1,1,2,3,1,1,1,2,1,1,1,1,1,3,1,2,3,15,16,17,88,80,1,0,48,14,56,57,58,59,60,62,64,66,68,72,2,4,6,8,18,20,22,24,26,32,12,28,40,0,1,8,16,9,2,3,10,17,24,32,25,18,11,4,5,12,19,26,33,40,48,41,34,27,20,13,6,7,14,21,28,35,42,49,56,57,50,43,36,29,22,15,23,30,37,44,51,58,59,52,45,38,31,39,46,53,60,61,54,47,55,62,63,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,0,3,1,2,0,0,0,0,0,1,2,3,4,8,0,0,0,0,0,0,0,1,2,3,4,5,8,9,0,0,0,0,0,1,2,3,4,6,8,10,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,6,8,8,12,0,0,0,0,16,0,0,0,32,0,0,0,8,0,0,0,16,0,0,0,3,0,0,0,4,0,0,0,5,0,0,0,6,0,0,0,241,241,242,242,243,243,244,244,245,245,246,246,247,247,248,248,249,249,250,250,251,251,252,252,253,253,254,254,255,255,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,0,249,249,249,249,250,250,250,250,251,251,251,251,252,252,252,252,253,253,253,253,254,254,254,254,255,255,255,255,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,255,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,255,255,255,0,255,255,255,0,255,255,255,0,255,255,255,0,255,255,255,0,255,255,255,0,255,255,255,0,255,255,255,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,3,0,0,0,2,0,0,0,3,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,0,3,0,0,0,1,0,0,0,3,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,3,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,3,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,2,0,0,0,2,0,0,0,1,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE+61440);
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
  function _rint(x) {
      if (Math.abs(x % 1) !== 0.5) return Math.round(x);
      return x + x % 2 + ((x < 0) ? 1 : -1);
    }var _rintf=_rint;
  var _fabsf=Math_abs;
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value;
      return value;
    }
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }
  var _SItoD=true;
  var _SItoF=true;
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    }
  Module["_memcpy"] = _memcpy;
  Module["_memmove"] = _memmove;var _llvm_memmove_p0i8_p0i8_i32=_memmove;
  var _BDtoILow=true;
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i32=_memset;
  var _FtoIHigh=true;
  var _DtoIHigh=true;
  Module["_bitshift64Shl"] = _bitshift64Shl;
  var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
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
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null; // EOF
                }
                return undefined; // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: '); // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 0777, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
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
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
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
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 0777 | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            if (canOwn && offset === 0) {
              node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
              node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) { // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) { // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  var IDBFS={dbs:{},indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },getDB:function (name, callback) {
        // check the cache first
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
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
          var fileStore;
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
          fileStore.createIndex('timestamp', 'timestamp', { unique: false });
        };
        req.onsuccess = function() {
          db = req.result;
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function() {
          callback(this.error);
        };
      },getLocalSet:function (mount, callback) {
        var entries = {};
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
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
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function (mount, callback) {
        var entries = {};
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function() { callback(this.error); };
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          var index = store.index('timestamp');
          index.openKeyCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, entries: entries });
            }
            entries[cursor.primaryKey] = { timestamp: cursor.key };
            cursor.continue();
          };
        });
      },loadLocalEntry:function (path, callback) {
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
          return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function (path, entry, callback) {
        try {
          if (FS.isDir(entry.mode)) {
            FS.mkdir(path, entry.mode);
          } else if (FS.isFile(entry.mode)) {
            FS.writeFile(path, entry.contents, { encoding: 'binary', canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
          FS.utime(path, entry.timestamp, entry.timestamp);
        } catch (e) {
          return callback(e);
        }
        callback(null);
      },removeLocalEntry:function (path, callback) {
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
      },loadRemoteEntry:function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function() { callback(this.error); };
      },storeRemoteEntry:function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },removeRemoteEntry:function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },reconcile:function (src, dst, callback) {
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
        var completed = 0;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= total) {
            return callback(null);
          }
        };
        transaction.onerror = function() { done(this.error); };
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
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
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      }};
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so 
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
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
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
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
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) { // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) { // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.position = position;
          return position;
        }}};
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
        if (opts.recurse_count > 8) { // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
        // start at the root
        var current = FS.root;
        var current_path = '/';
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
              if (count++ > 40) { // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
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
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this; // root node sets parent to itself
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
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
        var node = new FS.FSNode(parent, name, mode, rdev);
        FS.hashAddNode(node);
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return !!node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 || // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        if (stream.__proto__) {
          // reuse the object
          stream.__proto__ = FS.FSStream.prototype;
        } else {
          var newStream = new FS.FSStream();
          for (var p in stream) {
            newStream[p] = stream[p];
          }
          stream = newStream;
        }
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },getStreamFromPtr:function (ptr) {
        return FS.streams[ptr - 1];
      },getPtrForStream:function (stream) {
        return stream ? stream.fd + 1 : 0;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },getMounts:function (mount) {
        var mounts = [];
        var check = [mount];
        while (check.length) {
          var m = check.pop();
          mounts.push(m);
          check.push.apply(check, m.mounts);
        }
        return mounts;
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            callback(null);
          }
        };
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function (type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
          mountpoint = lookup.path; // use the absolute path
          node = lookup.node;
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
        }
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // destroy the nodes for this mount, and all its child mounts
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
        // no longer a mountpoint
        node.mounted = null;
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 0666;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 0777;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 0666;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 0666 : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node), // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0, opts.canOwn);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0, opts.canOwn);
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=FS.getPtrForStream(stdin);
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=FS.getPtrForStream(stdout);
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=FS.getPtrForStream(stderr);
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, '/');
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
        FS.ensureErrnoError();
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
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
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
              if (!hasByteServing) chunkSize = datalength;
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  function _mkport() { throw 'TODO' }var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 0777, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              var url = 'ws://' + addr + ':' + port;
              // the node ws library API is slightly different than the browser's
              var opts = ENVIRONMENT_IS_NODE ? {headers: {'websocket-protocol': ['binary']}} : ['binary'];
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined); // must receive an ArrayBuffer
            data = new Uint8Array(data); // make a typed array view on the array buffer
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer); // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
          var mask = 0;
          var dest = sock.type === 1 ? // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
          if (sock.recv_queue.length ||
              !dest || // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) { // let recv return 0 once closed
            mask |= (64 | 1);
          }
          if (!dest || // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL); // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL); // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else { // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  function _fileno(stream) {
      // int fileno(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fileno.html
      return FS.getStreamFromPtr(stream).fd;
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var fd = _fileno(stream);
      var bytesWritten = _write(fd, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  Module["_strlen"] = _strlen;
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = (HEAP32[((tempDoublePtr)>>2)]=HEAP32[(((varargs)+(argIndex))>>2)],HEAP32[(((tempDoublePtr)+(4))>>2)]=HEAP32[(((varargs)+((argIndex)+(4)))>>2)],(+(HEAPF64[(tempDoublePtr)>>3])));
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+4))>>2)]];
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Runtime.getNativeFieldSize(type);
        return ret;
      }
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
          // Handle precision.
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          }
          if (precision === -1) {
            precision = 6; // Standard default.
            precisionSet = false;
          }
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length;
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }function _printf(format, varargs) {
      // int printf(const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var stdout = HEAP32[((_stdout)>>2)];
      return _fprintf(stdout, format, varargs);
    }
  Module["_i64Subtract"] = _i64Subtract;
  function _memchr(ptr, chr, num) {
      chr = unSign(chr);
      for (var i = 0; i < num; i++) {
        if (HEAP8[(ptr)] == chr) return ptr;
        ptr++;
      }
      return 0;
    }
  var _DtoILow=true;
  function _OgvJsInitVideo(frameWidth, frameHeight,
                            hdec, vdec,
                               fps,
                               picWidth, picHeight,
                               picX, picY) {
    OgvJsInitVideoCallback({
     codec: "Theora",
     frameWidth: frameWidth,
     frameHeight: frameHeight,
     hdec: hdec,
     vdec: vdec,
     fps: fps,
     picWidth: picWidth,
     picHeight: picHeight,
     picX: picX,
     picY: picY
    });
   }
  function _OgvJsOutputAudio(buffers, channels, sampleCount) {
    if (buffers == 0) {
     OgvJsAudioCallback(null);
     return;
    }
    // buffers is an array of pointers to float arrays for each channel
    var HEAPU8 = Module.HEAPU8;
    var HEAPU32 = Module.HEAPU32;
    var HEAPF32 = Module.HEAPF32;
    var outputBuffers = [];
    if (buffers != 0) {
     var inBuffer, outBuffer, outArray, i;
     for (var channel = 0; channel < channels; channel++) {
      inBuffer = HEAPU32[buffers / 4 + channel];
      outBuffer = new ArrayBuffer(sampleCount * 4);
      outArray = new Float32Array(outBuffer);
      for (i = 0; i < sampleCount; i++) {
       outArray[i] = HEAPF32[inBuffer / 4 + i] ;
      }
      outputBuffers.push(outArray);
     }
    }
    OgvJsAudioCallback(outputBuffers);
   }
  Module["_i64Add"] = _i64Add;
  function _fputs(s, stream) {
      // int fputs(const char *restrict s, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputs.html
      var fd = _fileno(stream);
      return _write(fd, s, _strlen(s));
    }
  function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr;
      var fd = _fileno(stream);
      var ret = _write(fd, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }function _puts(s) {
      // int puts(const char *s);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/puts.html
      // NOTE: puts() always writes an extra newline.
      var stdout = HEAP32[((_stdout)>>2)];
      var ret = _fputs(s, stdout);
      if (ret < 0) {
        return ret;
      } else {
        var newlineRet = _fputc(10, stdout);
        return (newlineRet < 0) ? -1 : ret + 1;
      }
    }
  var _floor=Math_floor;
  function _OgvJsOutputFrameReady(videoPosition) {
    OgvJsOutputFrameReadyCallback(videoPosition);
   }
  function _OgvJsOutputAudioReady() {
    OgvJsOutputAudioReadyCallback();
   }
  var _sqrt=Math_sqrt;
  function _OgvJsOutputFrame(bufferY, strideY,
                              bufferCb, strideCb,
                              bufferCr, strideCr,
                              width, height,
                              hdec, vdec,
                              timestamp) {
    if (bufferY == 0) {
     OgvJsFrameCallback(null);
     return;
    }
    // Create typed array views of the source buffers from the emscripten heap:
    var HEAPU8 = Module.HEAPU8,
     HEAPU32 = Module.HEAPU32,
     widthColor = width >> hdec,
     heightColor = height >> vdec,
     countBytesY = strideY * height,
     countBytesCb = strideCb * heightColor,
     countBytesCr = strideCr * heightColor,
     bytesY = HEAPU8.subarray(bufferY, (bufferY + countBytesY)),
     bytesCb = HEAPU8.subarray(bufferCb, (bufferCb + countBytesCb)),
     bytesCr = HEAPU8.subarray(bufferCr, (bufferCr + countBytesCr));
    // And queue up the output buffer!
    OgvJsFrameCallback({
     bytesY: bytesY,
     bytesCb: bytesCb,
     bytesCr: bytesCr,
     strideY: strideY,
     strideCb: strideCb,
     strideCr: strideCr,
     width: width,
     height: height,
     hdec: hdec,
     vdec: vdec,
     timestamp: timestamp
    });
   }
  var Browser={mainLoop:{scheduler:null,method:"",shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        var ctx;
        try {
          if (useWebGL) {
            var contextAttributes = {
              antialias: false,
              alpha: false
            };
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
            var errorInfo = '?';
            function onContextCreationError(event) {
              errorInfo = event.statusMessage || errorInfo;
            }
            canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
            try {
              ['experimental-webgl', 'webgl'].some(function(webglId) {
                return ctx = canvas.getContext(webglId, contextAttributes);
              });
            } finally {
              canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
            }
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e]);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          GLctx = Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          setTimeout(func, 1000/60);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           window['setTimeout'];
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function (event) {
        return Math.max(-1, Math.min(1, event.type === 'DOMMouseScroll' ? event.detail : -event.wheelDelta));
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          // check if SDL is available
          if (typeof SDL != "undefined") {
           Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
           Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
           // just add the mouse delta to the current absolut mouse position
           // FIXME: ideally this should be clamped against the canvas size and zero
           Browser.mouseX += Browser.mouseMovementX;
           Browser.mouseY += Browser.mouseMovementY;
          }
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x, y;
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (scrollX + rect.left);
              y = t.pageY - (scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (scrollX + rect.left);
            y = event.pageY - (scrollY + rect.top);
          }
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available   
        if (typeof SDL != "undefined") {
         var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
         flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
         HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available       
        if (typeof SDL != "undefined") {
         var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
         flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
         HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
  var _pow=Math_pow;
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }
  var _UItoD=true;
  var _sin=Math_sin;
  Module["_bitshift64Ashr"] = _bitshift64Ashr;
  Module["_bitshift64Lshr"] = _bitshift64Lshr;
  var _atan=Math_atan;
  function _qsort(base, num, size, cmp) {
      if (num == 0 || size == 0) return;
      // forward calls to the JavaScript sort method
      // first, sort the items logically
      var keys = [];
      for (var i = 0; i < num; i++) keys.push(i);
      keys.sort(function(a, b) {
        return Module['dynCall_iii'](cmp, base+a*size, base+b*size);
      });
      // apply the sort
      var temp = _malloc(num*size);
      _memcpy(temp, base, num*size);
      for (var i = 0; i < num; i++) {
        if (keys[i] == i) continue; // already in place
        _memcpy(base+i*size, temp+keys[i]*size, size);
      }
      _free(temp);
    }
  var _BDtoIHigh=true;
  var _ceil=Math_ceil;
  var _log=Math_log;
  function _OgvJsInitAudio(channels, rate) {
    OgvJsInitAudioCallback({
     codec: "Vorbis",
     channels: channels,
     rate: rate
    });
   }
  var _cos=Math_cos;
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret; // Previous break location.
    }
  function ___errno_location() {
      return ___errno_state;
    }
  var _BItoD=true;
  function _abort() {
      Module['abort']();
    }
  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }
  var _exp=Math_exp;
  var _FtoILow=true;
  var _UItoF=true;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true; // seal the static portion of memory
STACK_MAX = STACK_BASE + 5242880;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");
 var ctlz_i8 = allocate([8,7,6,6,5,5,5,5,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_DYNAMIC);
 var cttz_i8 = allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0], "i8", ALLOC_DYNAMIC);
var Math_min = Math.min;
function invoke_iiiii(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_iiiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    return Module["dynCall_iiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
  try {
    return Module["dynCall_iiiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm=(function(global,env,buffer){"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=env.cttz_i8|0;var n=env.ctlz_i8|0;var o=0;var p=0;var q=0;var r=0;var s=+env.NaN,t=+env.Infinity;var u=0,v=0,w=0,x=0,y=0.0,z=0,A=0,B=0,C=0.0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=0;var M=0;var N=global.Math.floor;var O=global.Math.abs;var P=global.Math.sqrt;var Q=global.Math.pow;var R=global.Math.cos;var S=global.Math.sin;var T=global.Math.tan;var U=global.Math.acos;var V=global.Math.asin;var W=global.Math.atan;var X=global.Math.atan2;var Y=global.Math.exp;var Z=global.Math.log;var _=global.Math.ceil;var $=global.Math.imul;var aa=env.abort;var ba=env.assert;var ca=env.asmPrintInt;var da=env.asmPrintFloat;var ea=env.min;var fa=env.invoke_iiiii;var ga=env.invoke_vi;var ha=env.invoke_vii;var ia=env.invoke_ii;var ja=env.invoke_viii;var ka=env.invoke_iiiiiiiii;var la=env.invoke_iii;var ma=env.invoke_iiiiii;var na=env.invoke_viiii;var oa=env._sin;var pa=env._exp;var qa=env._send;var ra=env._pow;var sa=env._memchr;var ta=env.___setErrNo;var ua=env._OgvJsInitAudio;var va=env._floor;var wa=env._fflush;var xa=env._OgvJsInitVideo;var ya=env._pwrite;var za=env._OgvJsOutputFrameReady;var Aa=env.__reallyNegative;var Ba=env._fabsf;var Ca=env._sbrk;var Da=env._cos;var Ea=env._emscripten_memcpy_big;var Fa=env._fileno;var Ga=env._sysconf;var Ha=env.__formatString;var Ia=env._atan;var Ja=env._rint;var Ka=env._puts;var La=env._printf;var Ma=env._OgvJsOutputAudioReady;var Na=env._log;var Oa=env._write;var Pa=env.___errno_location;var Qa=env._fputc;var Ra=env._mkport;var Sa=env.__exit;var Ta=env._abort;var Ua=env._fwrite;var Va=env._time;var Wa=env._fprintf;var Xa=env._ceil;var Ya=env._qsort;var Za=env._fputs;var _a=env._sqrt;var $a=env._exit;var ab=env._OgvJsOutputAudio;var bb=env._OgvJsOutputFrame;var cb=0.0;
// EMSCRIPTEN_START_FUNCS
function mb(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+7&-8;return b|0}function nb(){return i|0}function ob(a){a=a|0;i=a}function pb(a,b){a=a|0;b=b|0;if((o|0)==0){o=a;p=b}}function qb(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0]}function rb(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0];a[k+4|0]=a[b+4|0];a[k+5|0]=a[b+5|0];a[k+6|0]=a[b+6|0];a[k+7|0]=a[b+7|0]}function sb(a){a=a|0;D=a}function tb(a){a=a|0;E=a}function ub(a){a=a|0;F=a}function vb(a){a=a|0;G=a}function wb(a){a=a|0;H=a}function xb(a){a=a|0;I=a}function yb(a){a=a|0;J=a}function zb(a){a=a|0;K=a}function Ab(a){a=a|0;L=a}function Bb(a){a=a|0;M=a}function Cb(b){b=b|0;var d=0,e=0;d=i;e=b;c[e+0>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;c[e+12>>2]=0;e=Ye(256)|0;c[b+8>>2]=e;c[b+12>>2]=e;a[e]=0;c[b+16>>2]=256;i=d;return}function Db(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0;g=i;do{if(!(f>>>0>32)){h=b+16|0;j=c[h>>2]|0;k=b+12|0;l=c[k>>2]|0;if((c[b>>2]|0)<(j+ -4|0)){m=l}else{if((l|0)==0){i=g;return}if((j|0)>2147483391){break}l=b+8|0;n=$e(c[l>>2]|0,j+256|0)|0;if((n|0)==0){break}c[l>>2]=n;c[h>>2]=(c[h>>2]|0)+256;h=n+(c[b>>2]|0)|0;c[k>>2]=h;m=h}h=c[8+(f<<2)>>2]&e;k=b+4|0;n=c[k>>2]|0;l=n+f|0;j=b+12|0;a[m]=d[m]|0|h<<n;do{if((l|0)>7){a[(c[j>>2]|0)+1|0]=h>>>(8-(c[k>>2]|0)|0);if((l|0)<=15){break}a[(c[j>>2]|0)+2|0]=h>>>(16-(c[k>>2]|0)|0);if((l|0)<=23){break}a[(c[j>>2]|0)+3|0]=h>>>(24-(c[k>>2]|0)|0);if((l|0)<=31){break}n=c[k>>2]|0;if((n|0)==0){a[(c[j>>2]|0)+4|0]=0;break}else{a[(c[j>>2]|0)+4|0]=h>>>(32-n|0);break}}}while(0);h=(l|0)/8|0;c[b>>2]=(c[b>>2]|0)+h;c[j>>2]=(c[j>>2]|0)+h;c[k>>2]=l&7;i=g;return}}while(0);m=c[b+8>>2]|0;if((m|0)!=0){Ze(m)}m=b;c[m+0>>2]=0;c[m+4>>2]=0;c[m+8>>2]=0;c[m+12>>2]=0;c[m+16>>2]=0;i=g;return}function Eb(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=i;f=a;c[f+0>>2]=0;c[f+4>>2]=0;c[f+8>>2]=0;c[f+12>>2]=0;c[a+12>>2]=b;c[a+8>>2]=b;c[a+16>>2]=d;i=e;return}function Fb(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;if(b>>>0>32){f=-1;i=e;return f|0}g=c[8+(b<<2)>>2]|0;h=c[a+4>>2]|0;j=h+b|0;b=c[a>>2]|0;k=c[a+16>>2]|0;do{if((b|0)>=(k+ -4|0)){if((b|0)>(k-(j+7>>3)|0)){f=-1;i=e;return f|0}if((j|0)==0){f=0}else{break}i=e;return f|0}}while(0);k=c[a+12>>2]|0;a=(d[k]|0)>>>h;do{if((j|0)>8){b=(d[k+1|0]|0)<<8-h|a;if((j|0)<=16){l=b;break}m=(d[k+2|0]|0)<<16-h|b;if((j|0)<=24){l=m;break}b=(d[k+3|0]|0)<<24-h|m;if((j|0)<33|(h|0)==0){l=b;break}l=(d[k+4|0]|0)<<32-h|b}else{l=a}}while(0);f=l&g;i=e;return f|0}function Gb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0;d=i;e=a+4|0;f=(c[e>>2]|0)+b|0;b=c[a>>2]|0;g=c[a+16>>2]|0;if((b|0)>(g-(f+7>>3)|0)){c[a+12>>2]=0;c[a>>2]=g;h=1;j=e;c[j>>2]=h;i=d;return}else{g=(f|0)/8|0;k=a+12|0;c[k>>2]=(c[k>>2]|0)+g;c[a>>2]=b+g;h=f&7;j=e;c[j>>2]=h;i=d;return}}function Hb(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;e=i;a:do{if(b>>>0>32){f=c[a+16>>2]|0;g=a;h=a+4|0}else{j=c[8+(b<<2)>>2]|0;k=a+4|0;l=c[k>>2]|0;m=l+b|0;n=c[a>>2]|0;o=c[a+16>>2]|0;do{if((n|0)>=(o+ -4|0)){if((n|0)>(o-(m+7>>3)|0)){f=o;g=a;h=k;break a}if((m|0)==0){p=0}else{break}i=e;return p|0}}while(0);o=a+12|0;q=c[o>>2]|0;r=(d[q]|0)>>>l;do{if((m|0)>8){s=(d[q+1|0]|0)<<8-l|r;if((m|0)<=16){t=s;break}u=(d[q+2|0]|0)<<16-l|s;if((m|0)<=24){t=u;break}s=(d[q+3|0]|0)<<24-l|u;if((m|0)<33|(l|0)==0){t=s;break}t=(d[q+4|0]|0)<<32-l|s}else{t=r}}while(0);r=(m|0)/8|0;c[o>>2]=q+r;c[a>>2]=n+r;c[k>>2]=m&7;p=t&j;i=e;return p|0}}while(0);c[a+12>>2]=0;c[g>>2]=f;c[h>>2]=1;p=-1;i=e;return p|0}function Ib(a){a=a|0;i=i;return(((c[a+4>>2]|0)+7|0)/8|0)+(c[a>>2]|0)|0}function Jb(a,b){a=a|0;b=b|0;var d=0;d=i;c[50]=a;c[52]=b;c[54]=0;Vb(224)|0;pc(256);nc(288);ue(304);se(320);i=d;return}function Kb(){var a=0,b=0,d=0,e=0,f=0,g=0,j=0,k=0.0,l=0.0;a=i;i=i+56|0;b=a;d=b;e=a+8|0;if((ac(384,744)|0)<1){Ka(1960)|0;f=0;i=a;return f|0}c[38]=0;g=$d(c[194]|0,744,160)|0;if((g|0)==0){j=160;k=+Me(c[194]|0,c[j>>2]|0,c[j+4>>2]|0);if(k>0.0){l=k}else{l=1.0/(+((c[348>>2]|0)>>>0)/+((c[352>>2]|0)>>>0))+ +h[21]}h[21]=l;c[48]=(c[48]|0)+1;ae(c[194]|0,e)|0;j=c[368>>2]|0;bb(c[e+12>>2]|0,c[e+8>>2]|0,c[e+28>>2]|0,c[e+24>>2]|0,c[e+44>>2]|0,c[e+40>>2]|0,c[324>>2]|0,c[328>>2]|0,j&1^1|0,j>>>1&1^1|0,+(+h[21]));f=1;i=a;return f|0}else if((g|0)==1){Ka(1944)|0;c[48]=(c[48]|0)+1;f=0;i=a;return f|0}else{c[b>>2]=g;La(784,d|0)|0;f=0;i=a;return f|0}return 0}function Lb(){var a=0,b=0,d=0,e=0,f=0,g=0;a=i;i=i+16|0;b=a;d=a+8|0;c[44]=0;if((ac(824,1184)|0)<=0){e=0;i=a;return e|0}f=md(1216,1184)|0;if((f|0)==0){jc(1328,1216)|0;g=kc(1328,d)|0;ab(c[d>>2]|0,c[260>>2]|0,g|0);lc(1328,g)|0;e=1;i=a;return e|0}else{c[b>>2]=f;La(1440,b|0)|0;e=0;i=a;return e|0}return 0}function Mb(a,b){a=a|0;b=b|0;var c=0;c=i;if((b|0)<=0){i=c;return}ff(Xb(224,b)|0,a|0,b|0)|0;Yb(224,b)|0;i=c;return}function Nb(){var b=0,d=0,e=0,f=0,g=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0.0,H=0,I=0,J=0,K=0;b=i;i=i+480|0;d=b;e=d;f=b+16|0;g=f;j=b+56|0;l=j;m=b+64|0;n=m;o=b+72|0;p=o;q=b+80|0;r=q;s=b+88|0;t=s;u=b+96|0;v=u;w=b+112|0;x=w;y=b+120|0;z=y;do{if(!(a[1480]&1)){if((_b(224,1488)|0)<=0){A=0;i=b;return A|0}if((c[36]|0)!=0){$b(384,1488)|0}if((c[46]|0)==0){break}$b(824,1488)|0}}while(0);B=c[54]|0;if((B|0)==0){if((Pb(1488)|0)==0){Ka(2448)|0;c[54]=1;A=1;i=b;return A|0}Ka(2480)|0;Rb(z,Qb(1488)|0)|0;$b(z,1488)|0;if((cc(z,1528)|0)==0){A=1;i=b;return A|0}do{if(!((c[52]|0)==0|(c[36]|0)!=0)){C=Xd(320,304,1504,1528)|0;c[378]=C;if(!((C|0)>-1)){break}Ka(2576)|0;ff(384,y|0,360)|0;c[36]=1;if((c[378]|0)==0){Ka(2600)|0;A=1;i=b;return A|0}else{ac(384,0)|0;A=1;i=b;return A|0}}}while(0);do{if(!((c[50]|0)==0|(c[46]|0)!=0)){C=rc(256,288,1528)|0;c[380]=C;if((C|0)!=0){break}c[w>>2]=0;La(1912,x|0)|0;ff(824,y|0,360)|0;c[46]=1;ac(824,0)|0;A=1;i=b;return A|0}}while(0);Ka(2520)|0;Sb(z)|0;A=1;i=b;return A|0}else if((B|0)==1){z=c[36]|0;y=c[378]|0;x=c[46]|0;do{if(!((z|0)!=0&(y|0)!=0)){if((x|0)!=0&(x|0)<3){break}c[o>>2]=z;c[p+4>>2]=x;La(1680,p|0)|0;if((c[36]|0)!=0){Ka(2024)|0;c[m>>2]=c[316>>2];La(1888,n|0)|0;do{if((c[312>>2]|0)!=0){Ka(2424)|0;w=c[312>>2]|0;if((w|0)>0){D=w;E=0}else{break}while(1){w=c[(c[76]|0)+(E<<2)>>2]|0;if((w|0)==0){F=D}else{c[j>>2]=c[(c[308>>2]|0)+(E<<2)>>2];c[l+4>>2]=w;La(1904,l|0)|0;F=c[312>>2]|0}w=E+1|0;if((w|0)<(F|0)){D=F;E=w}else{break}}}}while(0);c[194]=Zd(320,c[376]|0)|0;w=c[324>>2]|0;C=c[328>>2]|0;G=+((c[348>>2]|0)>>>0)/+((c[352>>2]|0)>>>0);H=c[332>>2]|0;I=c[336>>2]|0;J=c[340>>2]|0;K=c[344>>2]|0;c[f>>2]=c[720>>2];c[g+4>>2]=w;c[g+8>>2]=C;C=g+12|0;h[k>>3]=G;c[C>>2]=c[k>>2];c[C+4>>2]=c[k+4>>2];c[g+20>>2]=H;c[g+24>>2]=I;c[g+28>>2]=J;c[g+32>>2]=K;La(1712,g|0)|0;K=c[368>>2]|0;xa(c[324>>2]|0,c[328>>2]|0,K&1^1|0,K>>>1&1^1|0,+(+((c[348>>2]|0)>>>0)/+((c[352>>2]|0)>>>0)),c[332>>2]|0,c[336>>2]|0,c[340>>2]|0,c[344>>2]|0)}if((c[46]|0)!=0){ic(1328,256)|0;dc(1328,1216)|0;K=c[260>>2]|0;J=c[264>>2]|0;c[d>>2]=c[1160>>2];c[e+4>>2]=K;c[e+8>>2]=J;La(1824,e|0)|0;ua(c[260>>2]|0,c[264>>2]|0)}c[54]=2;Ka(2e3)|0;A=1;i=b;return A|0}}while(0);c[u>>2]=z;c[v+4>>2]=y;c[v+8>>2]=x;La(1560,v|0)|0;do{if((c[36]|0)!=0&(c[378]|0)!=0){Ka(2248)|0;v=cc(384,1528)|0;if((v|0)<0){c[s>>2]=v;La(1600,t|0)|0;$a(1)}if((v|0)>0){Ka(2312)|0;x=Xd(320,304,1504,1528)|0;c[378]=x;if((x|0)==0){Ka(2392)|0;c[36]=3}else{Ka(2360)|0;ac(384,0)|0}if((v|0)!=0){break}}Ka(2280)|0}}while(0);t=c[46]|0;if(!((t|0)!=0&(t|0)<3)){A=1;i=b;return A|0}Ka(2064)|0;t=cc(824,1528)|0;if((t|0)<0){c[q>>2]=t;La(1640,r|0)|0;$a(1)}do{if((t|0)>0){Ka(2128)|0;r=rc(256,288,1528)|0;c[380]=r;if((r|0)!=0){Ka(2176)|0;$a(1)}Ka(2200)|0;c[46]=(c[46]|0)+1;ac(824,0)|0;if((t|0)==0){break}else{A=1}i=b;return A|0}}while(0);Ka(2096)|0;A=1;i=b;return A|0}else if((B|0)==2){a[1480]=1;do{if(!((c[36]|0)==0|(c[38]|0)!=0)){if((cc(384,744)|0)>0){c[38]=1;za();break}else{a[1480]=0;break}}}while(0);if((c[46]|0)==0|(c[44]|0)!=0){A=1;i=b;return A|0}if((cc(824,1184)|0)>0){c[44]=1;Ma();A=1;i=b;return A|0}else{a[1480]=0;A=1;i=b;return A|0}}else{A=1;i=b;return A|0}return 0}function Ob(){var a=0,b=0,d=0;a=i;if((c[36]|0)==0){b=224;d=Wb(b)|0;i=a;return}Sb(384)|0;_d(c[194]|0);ve(304);te(320);b=224;d=Wb(b)|0;i=a;return}function Pb(b){b=b|0;i=i;return a[(c[b>>2]|0)+5|0]&2|0}function Qb(a){a=a|0;var b=0;b=c[a>>2]|0;i=i;return(d[b+15|0]|0)<<8|(d[b+14|0]|0)|(d[b+16|0]|0)<<16|(d[b+17|0]|0)<<24|0}function Rb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;if((a|0)==0){e=-1;i=d;return e|0}hf(a|0,0,360)|0;c[a+4>>2]=16384;c[a+24>>2]=1024;f=Ye(16384)|0;c[a>>2]=f;g=Ye(4096)|0;h=a+16|0;c[h>>2]=g;j=Ye(8192)|0;k=a+20|0;c[k>>2]=j;do{if((f|0)==0){l=g}else{if((g|0)==0|(j|0)==0){Ze(f);l=c[h>>2]|0;break}c[a+336>>2]=b;e=0;i=d;return e|0}}while(0);if((l|0)!=0){Ze(l)}l=c[k>>2]|0;if((l|0)!=0){Ze(l)}hf(a|0,0,360)|0;e=-1;i=d;return e|0}function Sb(a){a=a|0;var b=0,d=0;b=i;if((a|0)==0){i=b;return 0}d=c[a>>2]|0;if((d|0)!=0){Ze(d)}d=c[a+16>>2]|0;if((d|0)!=0){Ze(d)}d=c[a+20>>2]|0;if((d|0)!=0){Ze(d)}hf(a|0,0,360)|0;i=b;return 0}function Tb(b){b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;e=i;if((b|0)==0){i=e;return}a[(c[b>>2]|0)+22|0]=0;a[(c[b>>2]|0)+23|0]=0;a[(c[b>>2]|0)+24|0]=0;a[(c[b>>2]|0)+25|0]=0;f=c[b+4>>2]|0;if((f|0)>0){g=c[b>>2]|0;h=0;j=0;while(1){k=c[2640+(((d[g+j|0]|0)^h>>>24)<<2)>>2]^h<<8;l=j+1|0;if((l|0)<(f|0)){j=l;h=k}else{m=k;break}}}else{m=0}h=c[b+12>>2]|0;if((h|0)>0){j=c[b+8>>2]|0;f=m;g=0;do{n=c[2640+(((d[j+g|0]|0)^f>>>24)<<2)>>2]|0;f=n^f<<8;g=g+1|0;}while((g|0)<(h|0));o=n&255;p=f>>>16&255;q=f>>>24&255;r=f>>>8&255}else{o=m&255;p=m>>>16&255;q=m>>>24&255;r=m>>>8&255}a[(c[b>>2]|0)+22|0]=o;a[(c[b>>2]|0)+23|0]=r;a[(c[b>>2]|0)+24|0]=p;a[(c[b>>2]|0)+25|0]=q;i=e;return}function Ub(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;e=a+24|0;f=c[e>>2]|0;if((f-b|0)>(c[a+28>>2]|0)){g=0;i=d;return g|0}if((f|0)>(2147483647-b|0)){if((a|0)==0){g=-1;i=d;return g|0}h=c[a>>2]|0;if((h|0)!=0){Ze(h)}h=c[a+16>>2]|0;if((h|0)!=0){Ze(h)}h=c[a+20>>2]|0;if((h|0)!=0){Ze(h)}hf(a|0,0,360)|0;g=-1;i=d;return g|0}h=f+b|0;b=(h|0)<2147483615?h+32|0:h;h=a+16|0;f=$e(c[h>>2]|0,b<<2)|0;if((f|0)==0){j=c[a>>2]|0;if((j|0)!=0){Ze(j)}j=c[h>>2]|0;if((j|0)!=0){Ze(j)}j=c[a+20>>2]|0;if((j|0)!=0){Ze(j)}hf(a|0,0,360)|0;g=-1;i=d;return g|0}c[h>>2]=f;f=a+20|0;j=$e(c[f>>2]|0,b<<3)|0;if((j|0)!=0){c[f>>2]=j;c[e>>2]=b;g=0;i=d;return g|0}b=c[a>>2]|0;if((b|0)!=0){Ze(b)}b=c[h>>2]|0;if((b|0)!=0){Ze(b)}b=c[f>>2]|0;if((b|0)!=0){Ze(b)}hf(a|0,0,360)|0;g=-1;i=d;return g|0}function Vb(a){a=a|0;var b=0,d=0;b=i;if((a|0)==0){i=b;return 0}d=a;c[d+0>>2]=0;c[d+4>>2]=0;c[d+8>>2]=0;c[d+12>>2]=0;c[d+16>>2]=0;c[d+20>>2]=0;c[d+24>>2]=0;i=b;return 0}function Wb(a){a=a|0;var b=0,d=0;b=i;if((a|0)==0){i=b;return 0}d=c[a>>2]|0;if((d|0)!=0){Ze(d)}d=a;c[d+0>>2]=0;c[d+4>>2]=0;c[d+8>>2]=0;c[d+12>>2]=0;c[d+16>>2]=0;c[d+20>>2]=0;c[d+24>>2]=0;i=b;return 0}function Xb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;d=i;e=a+4|0;f=c[e>>2]|0;if(!((f|0)>-1)){g=0;i=d;return g|0}h=a+12|0;j=c[h>>2]|0;k=a+8|0;if((j|0)==0){l=f}else{m=(c[k>>2]|0)-j|0;c[k>>2]=m;if((m|0)>0){n=c[a>>2]|0;gf(n|0,n+j|0,m|0)|0;o=c[e>>2]|0}else{o=f}c[h>>2]=0;l=o}o=c[k>>2]|0;do{if((l-o|0)<(b|0)){h=b+4096+o|0;f=c[a>>2]|0;if((f|0)==0){p=Ye(h)|0}else{p=$e(f,h)|0}if((p|0)!=0){c[a>>2]=p;c[e>>2]=h;q=p;r=c[k>>2]|0;break}if((a|0)==0){g=0;i=d;return g|0}h=c[a>>2]|0;if((h|0)!=0){Ze(h)}h=a;c[h+0>>2]=0;c[h+4>>2]=0;c[h+8>>2]=0;c[h+12>>2]=0;c[h+16>>2]=0;c[h+20>>2]=0;c[h+24>>2]=0;g=0;i=d;return g|0}else{q=c[a>>2]|0;r=o}}while(0);g=q+r|0;i=d;return g|0}function Yb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;e=c[a+4>>2]|0;if(!((e|0)>-1)){f=-1;i=d;return f|0}g=a+8|0;a=(c[g>>2]|0)+b|0;if((a|0)>(e|0)){f=-1;i=d;return f|0}c[g>>2]=a;f=0;i=d;return f|0}function Zb(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0;f=i;i=i+24|0;g=f;h=g;j=f+8|0;k=j;l=c[b>>2]|0;m=b+12|0;n=c[m>>2]|0;o=l+n|0;p=b+8|0;q=(c[p>>2]|0)-n|0;if(!((c[b+4>>2]|0)>-1)){r=0;i=f;return r|0}s=b+20|0;t=c[s>>2]|0;do{if((t|0)==0){if((q|0)<27){r=0;i=f;return r|0}if((df(o,3664,4)|0)!=0){u=b+24|0;break}v=l+(n+26)|0;w=a[v]|0;x=(w&255)+27|0;if((q|0)<(x|0)){r=0;i=f;return r|0}if(!(w<<24>>24==0)){w=n+27|0;y=b+24|0;z=c[y>>2]|0;A=0;do{z=z+(d[l+(w+A)|0]|0)|0;c[y>>2]=z;A=A+1|0;}while((A|0)<(d[v]|0|0))}c[s>>2]=x;B=x;C=11}else{B=t;C=11}}while(0);do{if((C|0)==11){t=b+24|0;if((B+(c[t>>2]|0)|0)>(q|0)){r=0;i=f;return r|0}v=l+(n+22)|0;A=v;z=d[A]|d[A+1|0]<<8|d[A+2|0]<<16|d[A+3|0]<<24;c[g>>2]=z;A=v;a[A]=0;a[A+1|0]=0;a[A+2|0]=0;a[A+3|0]=0;c[j>>2]=o;A=c[s>>2]|0;c[k+4>>2]=A;c[k+8>>2]=l+(A+n);c[k+12>>2]=c[t>>2];Tb(k);if((df(h,v,4)|0)!=0){A=v;a[A]=z;a[A+1|0]=z>>8;a[A+2|0]=z>>16;a[A+3|0]=z>>24;u=t;break}z=c[b>>2]|0;A=c[m>>2]|0;if((e|0)==0){D=c[t>>2]|0;E=c[s>>2]|0}else{c[e>>2]=z+A;v=c[s>>2]|0;c[e+4>>2]=v;c[e+8>>2]=z+(v+A);z=c[t>>2]|0;c[e+12>>2]=z;D=z;E=v}c[b+16>>2]=0;v=D+E|0;c[m>>2]=A+v;c[s>>2]=0;c[t>>2]=0;r=v;i=f;return r|0}}while(0);c[s>>2]=0;c[u>>2]=0;u=sa(l+(n+1)|0,79,q+ -1|0)|0;q=c[b>>2]|0;if((u|0)==0){F=q+(c[p>>2]|0)|0}else{F=u}c[m>>2]=F-q;r=o-F|0;i=f;return r|0}function _b(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0;d=i;a:do{if((c[a+4>>2]|0)>-1){e=a+16|0;do{f=Zb(a,b)|0;if((f|0)>0){g=1;break a}if((f|0)==0){g=0;break a}}while((c[e>>2]|0)!=0);c[e>>2]=1;g=-1}else{g=0}}while(0);i=d;return g|0}function $b(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0;f=i;g=c[e>>2]|0;h=c[e+8>>2]|0;j=c[e+12>>2]|0;e=a[g+4|0]|0;k=d[g+5|0]|0;l=k&1;m=k&2;n=k&4;k=jf(d[g+13|0]|0|0,0,8)|0;o=jf(k|(d[g+12|0]|0)|0,D|0,8)|0;k=jf(o|(d[g+11|0]|0)|0,D|0,8)|0;o=jf(k|(d[g+10|0]|0)|0,D|0,8)|0;k=jf(o|(d[g+9|0]|0)|0,D|0,8)|0;o=jf(k|(d[g+8|0]|0)|0,D|0,8)|0;k=jf(o|(d[g+7|0]|0)|0,D|0,8)|0;o=k|(d[g+6|0]|0);k=D|0;p=(d[g+15|0]|0)<<8|(d[g+14|0]|0)|(d[g+16|0]|0)<<16|(d[g+17|0]|0)<<24;q=(d[g+19|0]|0)<<8|(d[g+18|0]|0)|(d[g+20|0]|0)<<16|(d[g+21|0]|0)<<24;r=d[g+26|0]|0;if((b|0)==0){s=-1;i=f;return s|0}t=c[b>>2]|0;if((t|0)==0){s=-1;i=f;return s|0}u=b+36|0;v=c[u>>2]|0;w=b+12|0;x=c[w>>2]|0;if((x|0)!=0){y=b+8|0;z=c[y>>2]|0;A=z-x|0;c[y>>2]=A;if((z|0)!=(x|0)){gf(t|0,t+x|0,A|0)|0}c[w>>2]=0}if((v|0)!=0){w=b+28|0;A=c[w>>2]|0;if((A|0)==(v|0)){B=v}else{x=c[b+16>>2]|0;gf(x|0,x+(v<<2)|0,A-v<<2|0)|0;A=c[b+20>>2]|0;gf(A|0,A+(v<<3)|0,(c[w>>2]|0)-v<<3|0)|0;B=c[w>>2]|0}c[w>>2]=B-v;B=b+32|0;c[B>>2]=(c[B>>2]|0)-v;c[u>>2]=0}if((p|0)!=(c[b+336>>2]|0)|e<<24>>24!=0){s=-1;i=f;return s|0}if((Ub(b,r+1|0)|0)!=0){s=-1;i=f;return s|0}e=b+340|0;p=c[e>>2]|0;do{if((q|0)!=(p|0)){u=b+32|0;v=c[u>>2]|0;B=b+28|0;w=c[B>>2]|0;if((v|0)<(w|0)){A=c[b+16>>2]|0;x=b+8|0;t=c[x>>2]|0;z=v;do{t=t-(c[A+(z<<2)>>2]&255)|0;z=z+1|0;}while((z|0)<(w|0));c[x>>2]=t}c[B>>2]=v;if((p|0)==-1){break}w=v+1|0;c[B>>2]=w;c[(c[b+16>>2]|0)+(v<<2)>>2]=1024;c[u>>2]=w}}while(0);a:do{if((l|0)==0){C=h;E=j;F=m;G=0}else{p=c[b+28>>2]|0;if((p|0)<1){H=h;I=j;J=0}else{if((c[(c[b+16>>2]|0)+(p+ -1<<2)>>2]|0)==1024){H=h;I=j;J=0}else{C=h;E=j;F=m;G=0;break}}while(1){if((J|0)>=(r|0)){C=H;E=I;F=0;G=J;break a}p=a[g+(J+27)|0]|0;w=p&255;z=H+w|0;A=I-w|0;w=J+1|0;if(p<<24>>24==-1){H=z;I=A;J=w}else{C=z;E=A;F=0;G=w;break}}}}while(0);if((E|0)!=0){J=b+4|0;I=c[J>>2]|0;H=b+8|0;m=c[H>>2]|0;do{if((I-E|0)>(m|0)){K=c[b>>2]|0;L=m}else{if((I|0)>(2147483647-E|0)){j=c[b>>2]|0;if((j|0)!=0){Ze(j)}j=c[b+16>>2]|0;if((j|0)!=0){Ze(j)}j=c[b+20>>2]|0;if((j|0)!=0){Ze(j)}hf(b|0,0,360)|0;s=-1;i=f;return s|0}j=I+E|0;h=(j|0)<2147482623?j+1024|0:j;j=$e(c[b>>2]|0,h)|0;if((j|0)!=0){c[J>>2]=h;c[b>>2]=j;K=j;L=c[H>>2]|0;break}j=c[b>>2]|0;if((j|0)!=0){Ze(j)}j=c[b+16>>2]|0;if((j|0)!=0){Ze(j)}j=c[b+20>>2]|0;if((j|0)!=0){Ze(j)}hf(b|0,0,360)|0;s=-1;i=f;return s|0}}while(0);ff(K+L|0,C|0,E|0)|0;c[H>>2]=(c[H>>2]|0)+E}do{if((G|0)<(r|0)){E=b+28|0;H=b+32|0;C=c[b+16>>2]|0;L=c[b+20>>2]|0;K=c[E>>2]|0;J=F;I=-1;m=G;b:while(1){j=K;h=J;l=m;while(1){u=a[g+(l+27)|0]|0;v=u&255;B=C+(j<<2)|0;c[B>>2]=v;t=L+(j<<3)|0;c[t>>2]=-1;c[t+4>>2]=-1;if((h|0)!=0){c[B>>2]=v|256}M=j+1|0;c[E>>2]=M;N=l+1|0;if(!(u<<24>>24==-1)){break}if((N|0)<(r|0)){j=M;h=0;l=N}else{O=I;break b}}c[H>>2]=M;if((N|0)<(r|0)){K=M;J=0;I=j;m=N}else{O=j;break}}if((O|0)==-1){break}m=(c[b+20>>2]|0)+(O<<3)|0;c[m>>2]=o;c[m+4>>2]=k}}while(0);do{if((n|0)!=0){c[b+328>>2]=1;k=c[b+28>>2]|0;if((k|0)<=0){break}o=(c[b+16>>2]|0)+(k+ -1<<2)|0;c[o>>2]=c[o>>2]|512}}while(0);c[e>>2]=q+1;s=0;i=f;return s|0}function ac(a,b){a=a|0;b=b|0;var d=0,e=0;d=i;do{if((a|0)==0){e=0}else{if((c[a>>2]|0)==0){e=0;break}e=bc(a,b,1)|0}}while(0);i=d;return e|0}function bc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;e=i;f=a+36|0;g=c[f>>2]|0;if((c[a+32>>2]|0)<=(g|0)){h=0;i=e;return h|0}j=c[a+16>>2]|0;k=c[j+(g<<2)>>2]|0;if((k&1024|0)!=0){c[f>>2]=g+1;l=a+344|0;m=l;n=mf(c[m>>2]|0,c[m+4>>2]|0,1,0)|0;m=l;c[m>>2]=n;c[m+4>>2]=D;h=-1;i=e;return h|0}m=(b|0)!=0;n=(d|0)==0;if(n&(m^1)){h=1;i=e;return h|0}d=k&255;l=k&512;o=k&256;if((d|0)==255){k=255;p=l;q=g;while(1){r=q+1|0;s=c[j+(r<<2)>>2]|0;t=s&255;u=(s&512|0)==0?p:512;s=t+k|0;if((t|0)==255){q=r;p=u;k=s}else{v=s;w=u;x=r;break}}}else{v=d;w=l;x=g}if(m){c[b+12>>2]=w;c[b+8>>2]=o;c[b>>2]=(c[a>>2]|0)+(c[a+12>>2]|0);o=a+344|0;w=c[o+4>>2]|0;m=b+24|0;c[m>>2]=c[o>>2];c[m+4>>2]=w;w=(c[a+20>>2]|0)+(x<<3)|0;m=c[w+4>>2]|0;o=b+16|0;c[o>>2]=c[w>>2];c[o+4>>2]=m;c[b+4>>2]=v}if(n){h=1;i=e;return h|0}n=a+12|0;c[n>>2]=(c[n>>2]|0)+v;c[f>>2]=x+1;x=a+344|0;a=x;f=mf(c[a>>2]|0,c[a+4>>2]|0,1,0)|0;a=x;c[a>>2]=f;c[a+4>>2]=D;h=1;i=e;return h|0}function cc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;d=i;if((a|0)==0){e=0;i=d;return e|0}f=c[a>>2]|0;if((f|0)==0){e=0;i=d;return e|0}g=a+36|0;h=c[g>>2]|0;if((c[a+32>>2]|0)<=(h|0)){e=0;i=d;return e|0}j=c[a+16>>2]|0;k=c[j+(h<<2)>>2]|0;if((k&1024|0)!=0){c[g>>2]=h+1;g=a+344|0;l=g;m=mf(c[l>>2]|0,c[l+4>>2]|0,1,0)|0;l=g;c[l>>2]=m;c[l+4>>2]=D;e=-1;i=d;return e|0}if((b|0)==0){e=1;i=d;return e|0}l=k&255;m=k&512;g=k&256;if((l|0)==255){k=255;n=m;o=h;while(1){p=o+1|0;q=c[j+(p<<2)>>2]|0;r=q&255;s=(q&512|0)==0?n:512;q=r+k|0;if((r|0)==255){o=p;n=s;k=q}else{t=q;u=s;v=p;break}}}else{t=l;u=m;v=h}c[b+12>>2]=u;c[b+8>>2]=g;c[b>>2]=f+(c[a+12>>2]|0);f=a+344|0;g=c[f+4>>2]|0;u=b+24|0;c[u>>2]=c[f>>2];c[u+4>>2]=g;g=(c[a+20>>2]|0)+(v<<3)|0;v=c[g+4>>2]|0;a=b+16|0;c[a>>2]=c[g>>2];c[a+4>>2]=v;c[b+4>>2]=t;e=1;i=d;return e|0}function dc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0;d=i;e=b+0|0;f=e+112|0;do{c[e>>2]=0;e=e+4|0}while((e|0)<(f|0));c[b+64>>2]=a;c[b+76>>2]=0;c[b+68>>2]=0;if((c[a>>2]|0)==0){i=d;return 0}a=_e(1,72)|0;c[b+104>>2]=a;g[a+4>>2]=-9999.0;e=b+4|0;b=a+12|0;f=0;while(1){if((f|0)==7){c[a+40>>2]=e;Cb(e);f=f+1|0;continue}else{h=_e(1,20)|0;c[b+(f<<2)>>2]=h;Cb(h);h=f+1|0;if((h|0)<15){f=h;continue}else{break}}}i=d;return 0}function ec(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;d=i;e=b+7&-8;b=a+72|0;f=c[b>>2]|0;g=a+76|0;h=a+68|0;j=c[h>>2]|0;if((f+e|0)<=(c[g>>2]|0)){k=j;l=f;m=k+l|0;n=l+e|0;o=b;c[o>>2]=n;i=d;return m|0}if((j|0)!=0){p=Ye(8)|0;q=a+80|0;c[q>>2]=(c[q>>2]|0)+f;f=a+84|0;c[p+4>>2]=c[f>>2];c[p>>2]=j;c[f>>2]=p}c[g>>2]=e;g=Ye(e)|0;c[h>>2]=g;c[b>>2]=0;k=g;l=0;m=k+l|0;n=l+e|0;o=b;c[o>>2]=n;i=d;return m|0}function fc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;b=i;d=a+84|0;e=c[d>>2]|0;if((e|0)!=0){f=e;while(1){e=c[f+4>>2]|0;Ze(c[f>>2]|0);Ze(f);if((e|0)==0){break}else{f=e}}}f=a+80|0;e=c[f>>2]|0;if((e|0)==0){g=a+72|0;h=g;c[h>>2]=0;j=d;c[j>>2]=0;i=b;return}k=a+68|0;l=a+76|0;c[k>>2]=$e(c[k>>2]|0,(c[l>>2]|0)+e|0)|0;c[l>>2]=(c[l>>2]|0)+(c[f>>2]|0);c[f>>2]=0;g=a+72|0;h=g;c[h>>2]=0;j=d;c[j>>2]=0;i=b;return}function gc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;e=i;f=c[b+28>>2]|0;if((f|0)==0){g=1;i=e;return g|0}h=c[f+3656>>2]|0;j=a+0|0;k=j+112|0;do{c[j>>2]=0;j=j+4|0}while((j|0)<(k|0));j=_e(1,136)|0;c[a+104>>2]=j;c[a+4>>2]=b;k=c[f+8>>2]|0;l=(k|0)==0?0:k+ -1|0;if((l|0)==0){m=0}else{k=l;l=0;while(1){n=l+1|0;o=k>>>1;if((o|0)==0){m=n;break}else{l=n;k=o}}}c[j+44>>2]=m;m=_e(1,4)|0;c[j+12>>2]=m;k=_e(1,4)|0;l=j+16|0;c[l>>2]=k;o=_e(1,20)|0;c[m>>2]=o;c[k>>2]=_e(1,20)|0;sc(o,c[f>>2]>>h);o=f+4|0;sc(c[c[l>>2]>>2]|0,c[o>>2]>>h);h=c[f>>2]|0;l=(h|0)==0?0:h+ -1|0;if((l|0)==0){p=-6}else{k=l;l=0;while(1){m=k>>>1;if((m|0)==0){break}else{l=l+1|0;k=m}}p=l+ -5|0}c[j+4>>2]=p;p=c[o>>2]|0;l=(p|0)==0?0:p+ -1|0;if((l|0)==0){q=-6}else{p=l;l=0;while(1){k=p>>>1;if((k|0)==0){break}else{l=l+1|0;p=k}}q=l+ -5|0}c[j+8>>2]=q;a:do{if((d|0)==0){q=f+2848|0;if((c[q>>2]|0)!=0){break}l=f+24|0;c[q>>2]=_e(c[l>>2]|0,56)|0;p=c[l>>2]|0;if((p|0)<=0){break}k=f+1824|0;m=p;p=0;while(1){n=k+(p<<2)|0;r=c[n>>2]|0;if((r|0)==0){s=m;break}if((ed((c[q>>2]|0)+(p*56|0)|0,r)|0)!=0){t=27;break}bd(c[n>>2]|0);c[n>>2]=0;p=p+1|0;m=c[l>>2]|0;if((p|0)>=(m|0)){break a}}if((t|0)==27){s=c[l>>2]|0}if((s|0)>0){m=s;p=0;while(1){q=k+(p<<2)|0;n=c[q>>2]|0;if((n|0)==0){u=m}else{bd(n);c[q>>2]=0;u=c[l>>2]|0}q=p+1|0;if((q|0)<(u|0)){m=u;p=q}else{break}}}hc(a);g=-1;i=e;return g|0}else{hd(j+20|0,h);hd(j+32|0,c[o>>2]|0);p=f+2848|0;b:do{if((c[p>>2]|0)==0){m=f+24|0;l=_e(c[m>>2]|0,56)|0;c[p>>2]=l;if((c[m>>2]|0)<=0){break}k=f+1824|0;q=l;l=0;while(1){dd(q+(l*56|0)|0,c[k+(l<<2)>>2]|0)|0;n=l+1|0;if((n|0)>=(c[m>>2]|0)){break b}q=c[p>>2]|0;l=n}}}while(0);p=f+28|0;l=_e(c[p>>2]|0,52)|0;q=j+56|0;c[q>>2]=l;c:do{if((c[p>>2]|0)>0){m=f+2852|0;k=f+2868|0;n=b+8|0;r=l;v=0;while(1){w=c[m+(v<<2)>>2]|0;Ac(r+(v*52|0)|0,w,k,(c[f+(c[w>>2]<<2)>>2]|0)/2|0,c[n>>2]|0);w=v+1|0;if((w|0)>=(c[p>>2]|0)){break c}r=c[q>>2]|0;v=w}}}while(0);c[a>>2]=1}}while(0);h=c[o>>2]|0;c[a+16>>2]=h;u=c[b+4>>2]|0;b=u<<2;s=Ye(b)|0;t=a+8|0;c[t>>2]=s;c[a+12>>2]=Ye(b)|0;d:do{if((u|0)>0){b=s;d=0;while(1){c[b+(d<<2)>>2]=_e(h,4)|0;q=d+1|0;if((q|0)>=(u|0)){break d}b=c[t>>2]|0;d=q}}}while(0);c[a+36>>2]=0;c[a+40>>2]=0;t=(c[o>>2]|0)/2|0;c[a+48>>2]=t;c[a+20>>2]=t;t=f+16|0;o=j+48|0;c[o>>2]=_e(c[t>>2]|0,4)|0;u=f+20|0;h=j+52|0;c[h>>2]=_e(c[u>>2]|0,4)|0;if((c[t>>2]|0)>0){j=f+800|0;s=f+1056|0;d=0;do{b=jb[c[(c[28048+(c[j+(d<<2)>>2]<<2)>>2]|0)+8>>2]&15](a,c[s+(d<<2)>>2]|0)|0;c[(c[o>>2]|0)+(d<<2)>>2]=b;d=d+1|0;}while((d|0)<(c[t>>2]|0))}if((c[u>>2]|0)<=0){g=0;i=e;return g|0}t=f+1312|0;d=f+1568|0;f=0;while(1){o=jb[c[(c[28056+(c[t+(f<<2)>>2]<<2)>>2]|0)+8>>2]&15](a,c[d+(f<<2)>>2]|0)|0;c[(c[h>>2]|0)+(f<<2)>>2]=o;o=f+1|0;if((o|0)<(c[u>>2]|0)){f=o}else{g=0;break}}i=e;return g|0}function hc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;b=i;if((a|0)==0){i=b;return}d=c[a+4>>2]|0;e=(d|0)!=0;if(e){f=c[d+28>>2]|0}else{f=0}g=c[a+104>>2]|0;h=(g|0)!=0;if(h){j=c[g>>2]|0;if((j|0)!=0){mc(j);Ze(c[g>>2]|0)}j=g+12|0;k=c[j>>2]|0;if((k|0)!=0){tc(c[k>>2]|0);Ze(c[c[j>>2]>>2]|0);Ze(c[j>>2]|0)}j=g+16|0;k=c[j>>2]|0;if((k|0)!=0){tc(c[k>>2]|0);Ze(c[c[j>>2]>>2]|0);Ze(c[j>>2]|0)}j=g+48|0;k=c[j>>2]|0;if((k|0)!=0){do{if((f|0)==0){l=k}else{m=f+16|0;if((c[m>>2]|0)>0){n=k;o=0}else{l=k;break}while(1){eb[c[(c[28048+(c[f+800+(o<<2)>>2]<<2)>>2]|0)+16>>2]&15](c[n+(o<<2)>>2]|0);p=o+1|0;q=c[j>>2]|0;if((p|0)<(c[m>>2]|0)){o=p;n=q}else{l=q;break}}}}while(0);Ze(l)}l=g+52|0;n=c[l>>2]|0;if((n|0)!=0){do{if((f|0)==0){r=n}else{o=f+20|0;if((c[o>>2]|0)>0){s=n;t=0}else{r=n;break}while(1){eb[c[(c[28056+(c[f+1312+(t<<2)>>2]<<2)>>2]|0)+16>>2]&15](c[s+(t<<2)>>2]|0);j=t+1|0;k=c[l>>2]|0;if((j|0)<(c[o>>2]|0)){t=j;s=k}else{r=k;break}}}}while(0);Ze(r)}r=g+56|0;s=c[r>>2]|0;if((s|0)!=0){do{if((f|0)==0){u=s}else{t=f+28|0;if((c[t>>2]|0)>0){v=s;w=0}else{u=s;break}while(1){Cc(v+(w*52|0)|0);l=w+1|0;n=c[r>>2]|0;if((l|0)<(c[t>>2]|0)){w=l;v=n}else{u=n;break}}}}while(0);Ze(u)}u=c[g+60>>2]|0;if((u|0)!=0){yc(u)}pd(g+80|0);id(g+20|0);id(g+32|0)}u=a+8|0;v=c[u>>2]|0;do{if((v|0)!=0){do{if(e){w=d+4|0;r=c[w>>2]|0;if((r|0)>0){x=v;y=r;z=0}else{A=v;break}while(1){r=c[x+(z<<2)>>2]|0;if((r|0)==0){B=y}else{Ze(r);B=c[w>>2]|0}r=z+1|0;s=c[u>>2]|0;if((r|0)<(B|0)){x=s;y=B;z=r}else{A=s;break}}}else{A=v}}while(0);Ze(A);w=c[a+12>>2]|0;if((w|0)==0){break}Ze(w)}}while(0);if(h){h=c[g+64>>2]|0;if((h|0)!=0){Ze(h)}h=c[g+68>>2]|0;if((h|0)!=0){Ze(h)}h=c[g+72>>2]|0;if((h|0)!=0){Ze(h)}Ze(g)}g=a+0|0;a=g+112|0;do{c[g>>2]=0;g=g+4|0}while((g|0)<(a|0));i=b;return}function ic(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;if((gc(a,b,0)|0)!=0){hc(a);e=1;i=d;return e|0}b=c[a+4>>2]|0;f=c[a+104>>2]|0;if((f|0)==0|(b|0)==0){e=0;i=d;return e|0}g=c[b+28>>2]|0;if((g|0)==0){e=0;i=d;return e|0}b=c[g+3656>>2]|0;h=c[g+4>>2]>>b+1;c[a+48>>2]=h;c[a+20>>2]=h>>b;c[a+24>>2]=-1;b=a+32|0;h=a+56|0;c[h+0>>2]=-1;c[h+4>>2]=-1;c[h+8>>2]=-1;c[h+12>>2]=-1;c[b>>2]=0;b=f+128|0;c[b>>2]=-1;c[b+4>>2]=-1;e=0;i=d;return e|0}function jc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0;d=i;e=c[a+4>>2]|0;f=c[e+28>>2]|0;h=c[a+104>>2]|0;j=c[f+3656>>2]|0;if((b|0)==0){k=-131;i=d;return k|0}l=a+20|0;m=c[l>>2]|0;n=a+24|0;o=c[n>>2]|0;if(!((m|0)<=(o|0)|(o|0)==-1)){k=-131;i=d;return k|0}p=a+40|0;q=c[p>>2]|0;r=a+36|0;c[r>>2]=q;s=c[b+28>>2]|0;c[p>>2]=s;c[a+44>>2]=-1;t=a+64|0;u=t;v=c[u>>2]|0;w=c[u+4>>2]|0;if((v|0)==-1&(w|0)==-1){x=b+56|0;y=6}else{u=mf(v|0,w|0,1,0)|0;w=D;v=b+56|0;z=v;if((u|0)==(c[z>>2]|0)&(w|0)==(c[z+4>>2]|0)){A=u;B=w}else{x=v;y=6}}if((y|0)==6){y=a+56|0;c[y>>2]=-1;c[y+4>>2]=-1;y=h+128|0;c[y>>2]=-1;c[y+4>>2]=-1;y=x;A=c[y>>2]|0;B=c[y+4>>2]|0}y=t;c[y>>2]=A;c[y+4>>2]=B;do{if((c[b>>2]|0)==0){C=m;E=o}else{B=j+1|0;y=c[f+(s<<2)>>2]>>B;A=c[f>>2]>>B;t=c[f+4>>2]>>B;B=c[b+88>>2]|0;x=a+72|0;v=x;w=mf(c[v>>2]|0,c[v+4>>2]|0,B|0,((B|0)<0?-1:0)|0)|0;B=x;c[B>>2]=w;c[B+4>>2]=D;B=c[b+92>>2]|0;w=a+80|0;x=w;v=mf(c[x>>2]|0,c[x+4>>2]|0,B|0,((B|0)<0?-1:0)|0)|0;B=w;c[B>>2]=v;c[B+4>>2]=D;B=c[b+96>>2]|0;v=a+88|0;w=v;x=mf(c[w>>2]|0,c[w+4>>2]|0,B|0,((B|0)<0?-1:0)|0)|0;B=v;c[B>>2]=x;c[B+4>>2]=D;B=c[b+100>>2]|0;x=a+96|0;v=x;w=mf(c[v>>2]|0,c[v+4>>2]|0,B|0,((B|0)<0?-1:0)|0)|0;B=x;c[B>>2]=w;c[B+4>>2]=D;B=a+48|0;w=c[B>>2]|0;x=(w|0)==0;v=x?t:0;u=x?0:t;x=e+4|0;if((c[x>>2]|0)>0){z=h+4|0;F=a+8|0;G=(t|0)/2|0;H=(A|0)/2|0;I=G-H|0;J=(A|0)>0;K=H+G|0;H=A+ -1|0;L=(y|0)>0;M=h+8|0;N=(t|0)>0;O=t+ -1|0;P=G+v+((A|0)/-2|0)|0;G=s;Q=q;R=0;while(1){S=(G|0)!=0;a:do{if((Q|0)==0){T=nd((c[z>>2]|0)-j|0)|0;U=c[(c[F>>2]|0)+(R<<2)>>2]|0;V=c[(c[b>>2]|0)+(R<<2)>>2]|0;if(!S){if(J){W=0}else{X=V;Y=U;break}while(1){Z=U+(W+v<<2)|0;g[Z>>2]=+g[Z>>2]*+g[T+(H-W<<2)>>2]+ +g[V+(W<<2)>>2]*+g[T+(W<<2)>>2];Z=W+1|0;if((Z|0)<(A|0)){W=Z}else{X=V;Y=U;break a}}}if(J){Z=0;while(1){_=U+(Z+v<<2)|0;g[_>>2]=+g[_>>2]*+g[T+(H-Z<<2)>>2]+ +g[V+(Z+I<<2)>>2]*+g[T+(Z<<2)>>2];_=Z+1|0;if((_|0)<(A|0)){Z=_}else{$=A;break}}}else{$=0}if(($|0)<(K|0)){aa=$}else{X=V;Y=U;break}while(1){g[U+(aa+v<<2)>>2]=+g[V+(aa+I<<2)>>2];Z=aa+1|0;if((Z|0)<(K|0)){aa=Z}else{X=V;Y=U;break}}}else{if(S){U=nd((c[M>>2]|0)-j|0)|0;V=c[(c[F>>2]|0)+(R<<2)>>2]|0;Z=c[(c[b>>2]|0)+(R<<2)>>2]|0;if(N){ba=0}else{X=Z;Y=V;break}while(1){T=V+(ba+v<<2)|0;g[T>>2]=+g[T>>2]*+g[U+(O-ba<<2)>>2]+ +g[Z+(ba<<2)>>2]*+g[U+(ba<<2)>>2];T=ba+1|0;if((T|0)<(t|0)){ba=T}else{X=Z;Y=V;break}}}else{V=nd((c[z>>2]|0)-j|0)|0;Z=c[(c[F>>2]|0)+(R<<2)>>2]|0;U=c[(c[b>>2]|0)+(R<<2)>>2]|0;if(J){ca=0}else{X=U;Y=Z;break}while(1){T=Z+(P+ca<<2)|0;g[T>>2]=+g[T>>2]*+g[V+(H-ca<<2)>>2]+ +g[U+(ca<<2)>>2]*+g[V+(ca<<2)>>2];T=ca+1|0;if((T|0)<(A|0)){ca=T}else{X=U;Y=Z;break}}}}}while(0);if(L){S=0;do{g[Y+(S+u<<2)>>2]=+g[X+(S+y<<2)>>2];S=S+1|0;}while((S|0)<(y|0))}S=R+1|0;if((S|0)>=(c[x>>2]|0)){break}G=c[p>>2]|0;Q=c[r>>2]|0;R=S}da=c[n>>2]|0;ea=c[B>>2]|0}else{da=o;ea=w}c[B>>2]=(ea|0)==0?t:0;if((da|0)==-1){c[n>>2]=u;c[l>>2]=u;C=u;E=u;break}else{c[n>>2]=v;R=(((c[f+(c[p>>2]<<2)>>2]|0)/4|0)+((c[f+(c[r>>2]<<2)>>2]|0)/4|0)>>j)+v|0;c[l>>2]=R;C=R;E=v;break}}}while(0);da=h+128|0;h=da;ea=c[h>>2]|0;o=c[h+4>>2]|0;if((ea|0)==-1&(o|0)==-1){fa=0;ga=0}else{h=((c[f+(c[p>>2]<<2)>>2]|0)/4|0)+((c[f+(c[r>>2]<<2)>>2]|0)/4|0)|0;X=mf(h|0,((h|0)<0?-1:0)|0,ea|0,o|0)|0;fa=X;ga=D}X=da;c[X>>2]=fa;c[X+4>>2]=ga;ga=a+56|0;X=ga;fa=c[X>>2]|0;o=c[X+4>>2]|0;do{if((fa|0)==-1&(o|0)==-1){X=b+48|0;ea=X;h=c[ea>>2]|0;Y=c[ea+4>>2]|0;if((h|0)==-1&(Y|0)==-1){break}ea=ga;c[ea>>2]=h;c[ea+4>>2]=Y;ea=da;ca=c[ea>>2]|0;ba=c[ea+4>>2]|0;if(!((ba|0)>(Y|0)|(ba|0)==(Y|0)&ca>>>0>h>>>0)){break}h=X;X=lf(ca|0,ba|0,c[h>>2]|0,c[h+4>>2]|0)|0;h=(X|0)<0?0:X;if((c[b+44>>2]|0)==0){X=E+(h>>j)|0;c[n>>2]=(X|0)>(C|0)?C:X;break}else{X=C-E<<j;c[l>>2]=C-(((h|0)>(X|0)?X:h)>>j);break}}else{h=((c[f+(c[p>>2]<<2)>>2]|0)/4|0)+((c[f+(c[r>>2]<<2)>>2]|0)/4|0)|0;X=mf(h|0,((h|0)<0?-1:0)|0,fa|0,o|0)|0;h=D;ba=ga;c[ba>>2]=X;c[ba+4>>2]=h;ba=b+48|0;ca=c[ba>>2]|0;Y=c[ba+4>>2]|0;if((ca|0)==-1&(Y|0)==-1|(X|0)==(ca|0)&(h|0)==(Y|0)){break}do{if((h|0)>(Y|0)|(h|0)==(Y|0)&X>>>0>ca>>>0){ba=lf(X|0,h|0,ca|0,Y|0)|0;if((ba|0)==0){break}if((c[b+44>>2]|0)==0){break}ea=C-E<<j;aa=(ba|0)>(ea|0)?ea:ba;c[l>>2]=C-(((aa|0)<0?0:aa)>>j)}}while(0);h=ga;c[h>>2]=ca;c[h+4>>2]=Y}}while(0);if((c[b+44>>2]|0)==0){k=0;i=d;return k|0}c[a+32>>2]=1;k=0;i=d;return k|0}function kc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;d=i;e=c[a+24>>2]|0;if(!((e|0)>-1)){f=0;i=d;return f|0}g=c[a+20>>2]|0;if((e|0)>=(g|0)){f=0;i=d;return f|0}if((b|0)!=0){h=c[(c[a+4>>2]|0)+4>>2]|0;if((h|0)>0){j=a+8|0;k=a+12|0;l=0;while(1){c[(c[k>>2]|0)+(l<<2)>>2]=(c[(c[j>>2]|0)+(l<<2)>>2]|0)+(e<<2);m=l+1|0;if((m|0)<(h|0)){l=m}else{n=k;break}}}else{n=a+12|0}c[b>>2]=c[n>>2]}f=g-e|0;i=d;return f|0}function lc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;e=c[a+24>>2]|0;do{if((b|0)!=0){if((e+b|0)>(c[a+20>>2]|0)){f=-131}else{break}i=d;return f|0}}while(0);c[a+24>>2]=e+b;f=0;i=d;return f|0}function mc(a){a=a|0;var b=0;b=i;tc(a+16|0);Ze(c[a+48>>2]|0);Ze(c[a+64>>2]|0);Ze(c[a+80>>2]|0);Ze(c[a+96>>2]|0);Ze(c[a+112>>2]|0);Ze(c[a+128>>2]|0);Ze(c[a+144>>2]|0);Ze(c[a+36>>2]|0);Ze(c[a+152>>2]|0);Ze(c[a+160>>2]|0);hf(a|0,0,180)|0;i=b;return}function nc(a){a=a|0;var b=0,d=0;b=i;d=a;c[d+0>>2]=0;c[d+4>>2]=0;c[d+8>>2]=0;c[d+12>>2]=0;i=b;return}function oc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;b=i;if((a|0)==0){i=b;return}d=c[a>>2]|0;if((d|0)!=0){e=a+8|0;f=c[e>>2]|0;if((f|0)>0){g=f;f=d;h=0;while(1){j=c[f+(h<<2)>>2]|0;if((j|0)==0){k=f;l=g}else{Ze(j);k=c[a>>2]|0;l=c[e>>2]|0}j=h+1|0;if((j|0)<(l|0)){g=l;f=k;h=j}else{m=k;break}}}else{m=d}Ze(m)}m=c[a+4>>2]|0;if((m|0)!=0){Ze(m)}m=c[a+12>>2]|0;if((m|0)!=0){Ze(m)}m=a;c[m+0>>2]=0;c[m+4>>2]=0;c[m+8>>2]=0;c[m+12>>2]=0;i=b;return}function pc(a){a=a|0;var b=0,d=0;b=i;d=a;c[d+0>>2]=0;c[d+4>>2]=0;c[d+8>>2]=0;c[d+12>>2]=0;c[d+16>>2]=0;c[d+20>>2]=0;c[d+24>>2]=0;c[a+28>>2]=_e(1,3664)|0;i=b;return}function qc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;b=i;d=c[a+28>>2]|0;if((d|0)==0){e=a;c[e+0>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;c[e+12>>2]=0;c[e+16>>2]=0;c[e+20>>2]=0;c[e+24>>2]=0;c[e+28>>2]=0;i=b;return}f=d+8|0;g=c[f>>2]|0;if((g|0)>0){h=d+32|0;j=g;g=0;while(1){k=c[h+(g<<2)>>2]|0;if((k|0)==0){l=j}else{Ze(k);l=c[f>>2]|0}k=g+1|0;if((k|0)<(l|0)){j=l;g=k}else{break}}}g=d+12|0;l=c[g>>2]|0;if((l|0)>0){j=d+544|0;f=d+288|0;h=l;l=0;while(1){k=c[j+(l<<2)>>2]|0;if((k|0)==0){m=h}else{eb[c[(c[28072+(c[f+(l<<2)>>2]<<2)>>2]|0)+8>>2]&15](k);m=c[g>>2]|0}k=l+1|0;if((k|0)<(m|0)){h=m;l=k}else{break}}}l=d+16|0;m=c[l>>2]|0;if((m|0)>0){h=d+1056|0;g=d+800|0;f=m;m=0;while(1){j=c[h+(m<<2)>>2]|0;if((j|0)==0){n=f}else{eb[c[(c[28048+(c[g+(m<<2)>>2]<<2)>>2]|0)+12>>2]&15](j);n=c[l>>2]|0}j=m+1|0;if((j|0)<(n|0)){f=n;m=j}else{break}}}m=d+20|0;n=c[m>>2]|0;if((n|0)>0){f=d+1568|0;l=d+1312|0;g=n;n=0;while(1){h=c[f+(n<<2)>>2]|0;if((h|0)==0){o=g}else{eb[c[(c[28056+(c[l+(n<<2)>>2]<<2)>>2]|0)+12>>2]&15](h);o=c[m>>2]|0}h=n+1|0;if((h|0)<(o|0)){g=o;n=h}else{break}}}n=d+24|0;if((c[n>>2]|0)>0){o=d+1824|0;g=d+2848|0;m=0;while(1){l=c[o+(m<<2)>>2]|0;if((l|0)!=0){bd(l)}l=c[g>>2]|0;if((l|0)!=0){cd(l+(m*56|0)|0)}l=m+1|0;if((l|0)<(c[n>>2]|0)){m=l}else{p=g;break}}}else{p=d+2848|0}g=c[p>>2]|0;if((g|0)!=0){Ze(g)}g=d+28|0;if((c[g>>2]|0)>0){p=d+2852|0;m=0;do{zc(c[p+(m<<2)>>2]|0);m=m+1|0;}while((m|0)<(c[g>>2]|0))}Ze(d);e=a;c[e+0>>2]=0;c[e+4>>2]=0;c[e+8>>2]=0;c[e+12>>2]=0;c[e+16>>2]=0;c[e+20>>2]=0;c[e+24>>2]=0;c[e+28>>2]=0;i=b;return}function rc(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;f=i;i=i+32|0;g=f;h=f+24|0;j=h;if((e|0)==0){k=-133;i=f;return k|0}Eb(g,c[e>>2]|0,c[e+4>>2]|0);l=Hb(g,8)|0;a[h+0|0]=0;a[h+1|0]=0;a[h+2|0]=0;a[h+3|0]=0;a[h+4|0]=0;a[h]=Hb(g,8)|0;a[j+1|0]=Hb(g,8)|0;a[j+2|0]=Hb(g,8)|0;a[j+3|0]=Hb(g,8)|0;a[j+4|0]=Hb(g,8)|0;a[j+5|0]=Hb(g,8)|0;if((df(j,3672,6)|0)!=0){k=-132;i=f;return k|0}if((l|0)==5){if((c[b+8>>2]|0)==0){k=-133;i=f;return k|0}if((c[d+12>>2]|0)==0){k=-133;i=f;return k|0}j=c[b+28>>2]|0;if((j|0)==0){k=-129;i=f;return k|0}h=Hb(g,8)|0;m=j+24|0;c[m>>2]=h+1;a:do{if((h|0)>=0){n=j+1824|0;o=0;do{p=rd(g)|0;c[n+(o<<2)>>2]=p;o=o+1|0;if((p|0)==0){break a}}while((o|0)<(c[m>>2]|0));o=Hb(g,6)|0;if((o|0)<0){break}else{q=0}while(1){if((Hb(g,16)|0)!=0){break a}if((q|0)<(o|0)){q=q+1|0}else{break}}o=Hb(g,6)|0;n=j+16|0;c[n>>2]=o+1;if((o|0)<0){break}o=j+800|0;p=j+1056|0;r=0;do{s=Hb(g,16)|0;c[o+(r<<2)>>2]=s;if(s>>>0>1){break a}t=jb[c[(c[28048+(s<<2)>>2]|0)+4>>2]&15](b,g)|0;c[p+(r<<2)>>2]=t;r=r+1|0;if((t|0)==0){break a}}while((r|0)<(c[n>>2]|0));n=Hb(g,6)|0;r=j+20|0;c[r>>2]=n+1;if((n|0)<0){break}n=j+1312|0;p=j+1568|0;o=0;do{t=Hb(g,16)|0;c[n+(o<<2)>>2]=t;if(t>>>0>2){break a}s=jb[c[(c[28056+(t<<2)>>2]|0)+4>>2]&15](b,g)|0;c[p+(o<<2)>>2]=s;o=o+1|0;if((s|0)==0){break a}}while((o|0)<(c[r>>2]|0));r=Hb(g,6)|0;o=j+12|0;c[o>>2]=r+1;if((r|0)<0){break}r=j+288|0;p=j+544|0;n=(c[7018]|0)+4|0;s=0;do{t=Hb(g,16)|0;c[r+(s<<2)>>2]=t;if((t|0)!=0){break a}t=jb[c[n>>2]&15](b,g)|0;c[p+(s<<2)>>2]=t;s=s+1|0;if((t|0)==0){break a}}while((s|0)<(c[o>>2]|0));s=Hb(g,6)|0;p=j+8|0;c[p>>2]=s+1;if((s|0)<0){break}s=j+32|0;n=0;do{r=s+(n<<2)|0;c[r>>2]=_e(1,16)|0;t=Hb(g,1)|0;c[c[r>>2]>>2]=t;t=Hb(g,16)|0;c[(c[r>>2]|0)+4>>2]=t;t=Hb(g,16)|0;c[(c[r>>2]|0)+8>>2]=t;t=Hb(g,8)|0;u=c[r>>2]|0;c[u+12>>2]=t;if((c[u+4>>2]|0)>0){break a}if((c[u+8>>2]|0)>0){break a}n=n+1|0;if((t|0)>=(c[o>>2]|0)|(t|0)<0){break a}}while((n|0)<(c[p>>2]|0));if((Hb(g,1)|0)==1){k=0}else{break}i=f;return k|0}}while(0);qc(b);k=-133;i=f;return k|0}else if((l|0)==3){if((c[b+8>>2]|0)==0){k=-133;i=f;return k|0}j=Hb(g,32)|0;b:do{if((j|0)>=0){q=g+16|0;if((j|0)>((c[q>>2]|0)+ -8|0)){break}m=_e(j+1|0,1)|0;c[d+12>>2]=m;if((j|0)!=0){h=m;m=j;while(1){p=m+ -1|0;a[h]=Hb(g,8)|0;if((p|0)==0){break}else{m=p;h=h+1|0}}}h=Hb(g,32)|0;if((h|0)<0){break}m=c[q>>2]|0;if((h|0)>(m-(Ib(g)|0)>>2|0)){break}m=d+8|0;c[m>>2]=h;p=h+1|0;c[d>>2]=_e(p,4)|0;n=d+4|0;c[n>>2]=_e(p,4)|0;if((h|0)>0){h=0;do{p=Hb(g,32)|0;if((p|0)<0){break b}o=c[q>>2]|0;if((p|0)>(o-(Ib(g)|0)|0)){break b}c[(c[n>>2]|0)+(h<<2)>>2]=p;o=_e(p+1|0,1)|0;c[(c[d>>2]|0)+(h<<2)>>2]=o;if((p|0)!=0){o=c[(c[d>>2]|0)+(h<<2)>>2]|0;s=p;while(1){p=s+ -1|0;a[o]=Hb(g,8)|0;if((p|0)==0){break}else{s=p;o=o+1|0}}}h=h+1|0;}while((h|0)<(c[m>>2]|0))}if((Hb(g,1)|0)==1){k=0}else{break}i=f;return k|0}}while(0);oc(d);k=-133;i=f;return k|0}else if((l|0)==1){if((c[e+8>>2]|0)==0){k=-133;i=f;return k|0}e=b+8|0;if((c[e>>2]|0)!=0){k=-133;i=f;return k|0}l=c[b+28>>2]|0;if((l|0)==0){k=-129;i=f;return k|0}d=Hb(g,32)|0;c[b>>2]=d;if((d|0)!=0){k=-134;i=f;return k|0}d=b+4|0;c[d>>2]=Hb(g,8)|0;c[e>>2]=Hb(g,32)|0;c[b+12>>2]=Hb(g,32)|0;c[b+16>>2]=Hb(g,32)|0;c[b+20>>2]=Hb(g,32)|0;c[l>>2]=1<<(Hb(g,4)|0);j=1<<(Hb(g,4)|0);c[l+4>>2]=j;do{if((c[e>>2]|0)>=1){if((c[d>>2]|0)<1){break}m=c[l>>2]|0;if((m|0)<64|(j|0)<(m|0)|(j|0)>8192){break}if((Hb(g,1)|0)==1){k=0}else{break}i=f;return k|0}}while(0);qc(b);k=-133;i=f;return k|0}else{k=-133;i=f;return k|0}return 0}function sc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,j=0,k=0.0,l=0,m=0.0,n=0,o=0,p=0.0,q=0.0,r=0,s=0.0,t=0,u=0,v=0,w=0;d=i;e=(b|0)/4|0;f=Ye(e<<2)|0;h=Ye(e+b<<2)|0;j=b>>1;k=+(b|0);l=~~+Ja(+(+Z(+k)*1.4426950408889634));c[a+4>>2]=l;c[a>>2]=b;c[a+8>>2]=h;c[a+12>>2]=f;if((b|0)<=3){m=4.0/k;n=a+16|0;o=n;g[o>>2]=m;i=d;return}p=3.141592653589793/+(b|0);q=3.141592653589793/+(b<<1|0);r=0;do{s=+(r<<2|0)*p;t=r<<1;g[h+(t<<2)>>2]=+R(+s);u=t|1;g[h+(u<<2)>>2]=-+S(+s);s=+(u|0)*q;u=t+j|0;g[h+(u<<2)>>2]=+R(+s);g[h+(u+1<<2)>>2]=+S(+s);r=r+1|0;}while((r|0)<(e|0));e=(b|0)/8|0;r=(b|0)>7;if(!r){m=4.0/k;n=a+16|0;o=n;g[o>>2]=m;i=d;return}q=3.141592653589793/+(b|0);j=0;do{p=+(j<<2|2|0)*q;u=(j<<1)+b|0;g[h+(u<<2)>>2]=+R(+p)*.5;g[h+(u+1<<2)>>2]=+S(+p)*-.5;j=j+1|0;}while((j|0)<(e|0));j=(1<<l+ -1)+ -1|0;h=1<<l+ -2;if(r){v=0}else{m=4.0/k;n=a+16|0;o=n;g[o>>2]=m;i=d;return}do{r=h;l=0;b=0;while(1){if((r&v|0)==0){w=l}else{w=l|1<<b}u=b+1|0;t=h>>u;if((t|0)==0){break}else{r=t;l=w;b=u}}b=v<<1;c[f+(b<<2)>>2]=(j&~w)+ -1;c[f+((b|1)<<2)>>2]=w;v=v+1|0;}while((v|0)<(e|0));m=4.0/k;n=a+16|0;o=n;g[o>>2]=m;i=d;return}function tc(a){a=a|0;var b=0,d=0;b=i;if((a|0)==0){i=b;return}d=c[a+8>>2]|0;if((d|0)!=0){Ze(d)}d=c[a+12>>2]|0;if((d|0)!=0){Ze(d)}d=a;c[d+0>>2]=0;c[d+4>>2]=0;c[d+8>>2]=0;c[d+12>>2]=0;c[d+16>>2]=0;i=b;return}function uc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0.0,w=0,x=0;e=i;f=c[a>>2]|0;h=f>>1;j=f>>2;f=d+(h+j<<2)|0;k=a+8|0;l=c[k>>2]|0;m=l+(j<<2)|0;n=m;o=b+(h+ -7<<2)|0;p=f;while(1){q=p+ -16|0;r=o+8|0;s=n+12|0;t=n+8|0;g[q>>2]=-(+g[r>>2]*+g[s>>2])- +g[o>>2]*+g[t>>2];g[p+ -12>>2]=+g[o>>2]*+g[s>>2]- +g[r>>2]*+g[t>>2];t=o+24|0;r=n+4|0;s=o+16|0;g[p+ -8>>2]=-(+g[t>>2]*+g[r>>2])- +g[s>>2]*+g[n>>2];g[p+ -4>>2]=+g[s>>2]*+g[r>>2]- +g[t>>2]*+g[n>>2];t=o+ -32|0;if(t>>>0<b>>>0){break}else{p=q;o=t;n=n+16|0}}n=d+(h<<2)|0;o=m;m=b+(h+ -8<<2)|0;p=f;while(1){t=o+ -16|0;q=m+16|0;r=o+ -4|0;s=m+24|0;u=o+ -8|0;g[p>>2]=+g[q>>2]*+g[r>>2]+ +g[s>>2]*+g[u>>2];g[p+4>>2]=+g[q>>2]*+g[u>>2]- +g[s>>2]*+g[r>>2];r=o+ -12|0;s=m+8|0;g[p+8>>2]=+g[m>>2]*+g[r>>2]+ +g[s>>2]*+g[t>>2];g[p+12>>2]=+g[m>>2]*+g[t>>2]- +g[s>>2]*+g[r>>2];r=m+ -32|0;if(r>>>0<b>>>0){break}else{p=p+16|0;m=r;o=t}}vc(c[a+4>>2]|0,l,n,h);wc(c[a>>2]|0,c[k>>2]|0,c[a+12>>2]|0,d);a=(c[k>>2]|0)+(h<<2)|0;h=d;k=f;l=f;while(1){o=k+ -16|0;m=a+4|0;p=h+4|0;g[k+ -4>>2]=+g[h>>2]*+g[m>>2]- +g[p>>2]*+g[a>>2];g[l>>2]=-(+g[h>>2]*+g[a>>2]+ +g[p>>2]*+g[m>>2]);m=h+8|0;p=a+12|0;b=h+12|0;t=a+8|0;g[k+ -8>>2]=+g[m>>2]*+g[p>>2]- +g[b>>2]*+g[t>>2];g[l+4>>2]=-(+g[m>>2]*+g[t>>2]+ +g[b>>2]*+g[p>>2]);p=h+16|0;b=a+20|0;t=h+20|0;m=a+16|0;g[k+ -12>>2]=+g[p>>2]*+g[b>>2]- +g[t>>2]*+g[m>>2];g[l+8>>2]=-(+g[p>>2]*+g[m>>2]+ +g[t>>2]*+g[b>>2]);b=h+24|0;t=a+28|0;m=h+28|0;p=a+24|0;g[o>>2]=+g[b>>2]*+g[t>>2]- +g[m>>2]*+g[p>>2];g[l+12>>2]=-(+g[b>>2]*+g[p>>2]+ +g[m>>2]*+g[t>>2]);t=h+32|0;if(t>>>0<o>>>0){l=l+16|0;k=o;h=t;a=a+32|0}else{break}}a=d+(j<<2)|0;j=f;d=a;h=a;while(1){a=d+ -16|0;k=j+ -16|0;v=+g[j+ -4>>2];g[d+ -4>>2]=v;g[h>>2]=-v;v=+g[j+ -8>>2];g[d+ -8>>2]=v;g[h+4>>2]=-v;v=+g[j+ -12>>2];g[d+ -12>>2]=v;g[h+8>>2]=-v;v=+g[k>>2];g[a>>2]=v;g[h+12>>2]=-v;l=h+16|0;if(l>>>0<k>>>0){h=l;d=a;j=k}else{w=f;x=f;break}}while(1){f=x+ -16|0;g[f>>2]=+g[w+12>>2];g[x+ -12>>2]=+g[w+8>>2];g[x+ -8>>2]=+g[w+4>>2];g[x+ -4>>2]=+g[w>>2];if(f>>>0>n>>>0){x=f;w=w+16|0}else{break}}i=e;return}function vc(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0.0,m=0,n=0.0,o=0.0,p=0,q=0.0,r=0,s=0.0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0.0,K=0.0,L=0.0,M=0,N=0.0,O=0.0,P=0,Q=0,R=0,S=0,T=0.0,U=0.0,V=0,W=0,X=0,Y=0.0,Z=0.0,_=0.0,aa=0.0,ba=0.0,ca=0.0,da=0.0,ea=0.0,fa=0.0;e=i;if((a+ -6|0)>0){f=b;h=c+(d+ -8<<2)|0;j=c+((d>>1)+ -8<<2)|0;while(1){k=h+24|0;l=+g[k>>2];m=j+24|0;n=+g[m>>2];o=l-n;p=h+28|0;q=+g[p>>2];r=j+28|0;s=q- +g[r>>2];g[k>>2]=l+n;g[p>>2]=q+ +g[r>>2];p=f+4|0;g[m>>2]=s*+g[p>>2]+o*+g[f>>2];g[r>>2]=s*+g[f>>2]-o*+g[p>>2];p=h+16|0;o=+g[p>>2];r=j+16|0;s=+g[r>>2];q=o-s;m=h+20|0;n=+g[m>>2];k=j+20|0;l=n- +g[k>>2];g[p>>2]=o+s;g[m>>2]=n+ +g[k>>2];m=f+20|0;p=f+16|0;g[r>>2]=l*+g[m>>2]+q*+g[p>>2];g[k>>2]=l*+g[p>>2]-q*+g[m>>2];m=h+8|0;q=+g[m>>2];p=j+8|0;l=+g[p>>2];n=q-l;k=h+12|0;s=+g[k>>2];r=j+12|0;o=s- +g[r>>2];g[m>>2]=q+l;g[k>>2]=s+ +g[r>>2];k=f+36|0;m=f+32|0;g[p>>2]=o*+g[k>>2]+n*+g[m>>2];g[r>>2]=o*+g[m>>2]-n*+g[k>>2];n=+g[h>>2];o=+g[j>>2];s=n-o;k=h+4|0;l=+g[k>>2];m=j+4|0;q=l- +g[m>>2];g[h>>2]=n+o;g[k>>2]=l+ +g[m>>2];k=f+52|0;r=f+48|0;g[j>>2]=q*+g[k>>2]+s*+g[r>>2];g[m>>2]=q*+g[r>>2]-s*+g[k>>2];k=j+ -32|0;if(k>>>0<c>>>0){break}else{j=k;h=h+ -32|0;f=f+64|0}}}f=a+ -7|0;if((f|0)>0){a=f;f=1;while(1){h=1<<f;if((h|0)>0){j=d>>f;k=4<<f;r=j+ -8|0;m=(j>>1)+ -8|0;p=k+1|0;t=k<<1;u=t|1;v=t+k|0;w=v+1|0;x=v+k|0;y=0;do{z=$(y,j)|0;A=c+(z<<2)|0;B=b;C=c+(r+z<<2)|0;D=c+(m+z<<2)|0;while(1){z=C+24|0;s=+g[z>>2];E=D+24|0;q=+g[E>>2];l=s-q;F=C+28|0;o=+g[F>>2];G=D+28|0;n=o- +g[G>>2];g[z>>2]=s+q;g[F>>2]=o+ +g[G>>2];F=B+4|0;g[E>>2]=n*+g[F>>2]+l*+g[B>>2];g[G>>2]=n*+g[B>>2]-l*+g[F>>2];F=B+(k<<2)|0;G=C+16|0;l=+g[G>>2];E=D+16|0;n=+g[E>>2];o=l-n;z=C+20|0;q=+g[z>>2];H=D+20|0;s=q- +g[H>>2];g[G>>2]=l+n;g[z>>2]=q+ +g[H>>2];z=B+(p<<2)|0;g[E>>2]=s*+g[z>>2]+o*+g[F>>2];g[H>>2]=s*+g[F>>2]-o*+g[z>>2];z=B+(t<<2)|0;F=C+8|0;o=+g[F>>2];H=D+8|0;s=+g[H>>2];q=o-s;E=C+12|0;n=+g[E>>2];G=D+12|0;l=n- +g[G>>2];g[F>>2]=o+s;g[E>>2]=n+ +g[G>>2];E=B+(u<<2)|0;g[H>>2]=l*+g[E>>2]+q*+g[z>>2];g[G>>2]=l*+g[z>>2]-q*+g[E>>2];E=B+(v<<2)|0;q=+g[C>>2];l=+g[D>>2];n=q-l;z=C+4|0;s=+g[z>>2];G=D+4|0;o=s- +g[G>>2];g[C>>2]=q+l;g[z>>2]=s+ +g[G>>2];z=B+(w<<2)|0;g[D>>2]=o*+g[z>>2]+n*+g[E>>2];g[G>>2]=o*+g[E>>2]-n*+g[z>>2];z=D+ -32|0;if(z>>>0<A>>>0){break}else{D=z;C=C+ -32|0;B=B+(x<<2)|0}}y=y+1|0;}while((y|0)<(h|0))}h=a+ -1|0;if((h|0)>0){a=h;f=f+1|0}else{break}}}if((d|0)>0){I=0}else{i=e;return}do{f=c+(I<<2)|0;a=c+((I|30)<<2)|0;n=+g[a>>2];b=c+((I|14)<<2)|0;o=+g[b>>2];h=c+((I|31)<<2)|0;s=+g[h>>2];y=c+((I|15)<<2)|0;l=+g[y>>2];g[a>>2]=n+o;g[h>>2]=s+l;g[b>>2]=n-o;g[y>>2]=s-l;x=c+((I|28)<<2)|0;l=+g[x>>2];w=c+((I|12)<<2)|0;s=+g[w>>2];o=l-s;v=c+((I|29)<<2)|0;n=+g[v>>2];u=c+((I|13)<<2)|0;q=+g[u>>2];J=n-q;g[x>>2]=l+s;g[v>>2]=n+q;g[w>>2]=o*.9238795042037964-J*.3826834261417389;g[u>>2]=o*.3826834261417389+J*.9238795042037964;t=c+((I|26)<<2)|0;J=+g[t>>2];p=c+((I|10)<<2)|0;o=+g[p>>2];q=J-o;k=c+((I|27)<<2)|0;n=+g[k>>2];m=c+((I|11)<<2)|0;s=+g[m>>2];l=n-s;g[t>>2]=J+o;g[k>>2]=n+s;g[p>>2]=(q-l)*.7071067690849304;g[m>>2]=(q+l)*.7071067690849304;r=c+((I|24)<<2)|0;l=+g[r>>2];j=c+((I|8)<<2)|0;q=+g[j>>2];s=l-q;B=c+((I|25)<<2)|0;n=+g[B>>2];C=c+((I|9)<<2)|0;o=+g[C>>2];J=n-o;g[r>>2]=l+q;g[B>>2]=n+o;o=s*.3826834261417389-J*.9238795042037964;n=s*.9238795042037964+J*.3826834261417389;D=c+((I|22)<<2)|0;J=+g[D>>2];A=c+((I|6)<<2)|0;s=+g[A>>2];q=J-s;z=c+((I|7)<<2)|0;l=+g[z>>2];E=c+((I|23)<<2)|0;K=+g[E>>2];L=l-K;g[D>>2]=J+s;g[E>>2]=l+K;g[A>>2]=L;g[z>>2]=q;G=c+((I|4)<<2)|0;K=+g[G>>2];H=c+((I|20)<<2)|0;l=+g[H>>2];s=K-l;F=c+((I|5)<<2)|0;J=+g[F>>2];M=c+((I|21)<<2)|0;N=+g[M>>2];O=J-N;g[H>>2]=K+l;g[M>>2]=J+N;N=s*.3826834261417389+O*.9238795042037964;J=O*.3826834261417389-s*.9238795042037964;P=c+((I|2)<<2)|0;s=+g[P>>2];Q=c+((I|18)<<2)|0;O=+g[Q>>2];l=s-O;R=c+((I|3)<<2)|0;K=+g[R>>2];S=c+((I|19)<<2)|0;T=+g[S>>2];U=K-T;g[Q>>2]=s+O;g[S>>2]=K+T;T=(l+U)*.7071067690849304;K=(U-l)*.7071067690849304;l=+g[f>>2];V=c+((I|16)<<2)|0;U=+g[V>>2];O=l-U;W=c+((I|1)<<2)|0;s=+g[W>>2];X=c+((I|17)<<2)|0;Y=+g[X>>2];Z=s-Y;_=l+U;g[V>>2]=_;U=s+Y;g[X>>2]=U;Y=O*.9238795042037964+Z*.3826834261417389;s=Z*.9238795042037964-O*.3826834261417389;O=s-n;Z=Y-o;l=o+Y;Y=n+s;s=O+Z;n=O-Z;Z=+g[m>>2];O=K-Z;o=+g[p>>2];aa=o-T;ba=T+o;o=K+Z;Z=+g[w>>2];K=Z-N;T=+g[u>>2];ca=T-J;da=N+Z;Z=J+T;T=K-ca;J=K+ca;ca=+g[b>>2];K=ca-L;N=+g[y>>2];ea=N-q;fa=ca+L;L=N+q;q=O+K;N=K-O;O=(s+T)*.7071067690849304;K=(T-s)*.7071067690849304;g[A>>2]=q+O;g[G>>2]=q-O;O=(J-n)*.7071067690849304;q=ea-aa;g[f>>2]=N+O;g[P>>2]=N-O;O=(n+J)*.7071067690849304;J=aa+ea;g[R>>2]=K+q;g[W>>2]=q-K;g[z>>2]=O+J;g[F>>2]=J-O;O=ba+fa;J=fa-ba;ba=da+l;fa=da-l;g[b>>2]=ba+O;g[w>>2]=O-ba;ba=Z-Y;O=L-o;g[j>>2]=ba+J;g[p>>2]=J-ba;ba=Y+Z;Z=o+L;g[m>>2]=fa+O;g[C>>2]=O-fa;g[y>>2]=ba+Z;g[u>>2]=Z-ba;ba=+g[B>>2];Z=U-ba;fa=+g[r>>2];O=_-fa;L=_+fa;fa=U+ba;ba=Z+O;U=Z-O;O=+g[S>>2];Z=+g[k>>2];_=O-Z;o=+g[t>>2];Y=+g[Q>>2];J=o-Y;l=o+Y;Y=O+Z;Z=+g[x>>2];O=+g[H>>2];o=Z-O;da=+g[v>>2];K=+g[M>>2];q=da-K;ea=Z+O;O=da+K;K=o-q;da=o+q;q=+g[a>>2];o=+g[D>>2];Z=q-o;aa=+g[h>>2];n=+g[E>>2];N=aa-n;s=q+o;o=aa+n;n=_+Z;aa=Z-_;_=(ba+K)*.7071067690849304;Z=(K-ba)*.7071067690849304;g[D>>2]=n+_;g[H>>2]=n-_;_=(da-U)*.7071067690849304;n=N-J;g[V>>2]=aa+_;g[Q>>2]=aa-_;_=(U+da)*.7071067690849304;da=J+N;g[S>>2]=Z+n;g[X>>2]=n-Z;g[E>>2]=_+da;g[M>>2]=da-_;_=l+s;da=s-l;l=L+ea;s=ea-L;g[a>>2]=l+_;g[x>>2]=_-l;l=O-fa;_=o-Y;g[r>>2]=l+da;g[t>>2]=da-l;l=fa+O;O=Y+o;g[k>>2]=s+_;g[B>>2]=_-s;g[h>>2]=l+O;g[v>>2]=O-l;I=I+32|0;}while((I|0)<(d|0));i=e;return}function wc(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0,v=0.0,w=0;f=i;h=a>>1;j=b+(a<<2)|0;a=d;d=e;b=e+(h<<2)|0;while(1){k=(c[a>>2]|0)+h|0;l=(c[a+4>>2]|0)+h|0;m=+g[e+(k+1<<2)>>2];n=+g[e+(l+1<<2)>>2];o=m-n;p=+g[e+(k<<2)>>2];q=+g[e+(l<<2)>>2];r=p+q;s=+g[j>>2];t=+g[j+4>>2];u=r*s+o*t;v=r*t-o*s;l=b+ -16|0;s=(m+n)*.5;n=(p-q)*.5;g[d>>2]=s+u;g[b+ -8>>2]=s-u;g[d+4>>2]=n+v;g[b+ -4>>2]=v-n;k=(c[a+8>>2]|0)+h|0;w=(c[a+12>>2]|0)+h|0;n=+g[e+(k+1<<2)>>2];v=+g[e+(w+1<<2)>>2];u=n-v;s=+g[e+(k<<2)>>2];q=+g[e+(w<<2)>>2];p=s+q;m=+g[j+8>>2];o=+g[j+12>>2];t=p*m+u*o;r=p*o-u*m;m=(n+v)*.5;v=(s-q)*.5;g[d+8>>2]=m+t;g[l>>2]=m-t;g[d+12>>2]=v+r;g[b+ -12>>2]=r-v;w=d+16|0;if(w>>>0<l>>>0){b=l;d=w;a=a+16|0;j=j+16|0}else{break}}i=f;return}function xc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0.0,B=0.0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;e=i;f=c[a>>2]|0;h=f>>1;j=f>>2;k=f>>3;l=i;i=i+((1*(f<<2)|0)+7&-8)|0;m=l;l=m+(h<<2)|0;n=h+j|0;o=b+(n<<2)|0;p=a+8|0;q=c[p>>2]|0;r=q+(h<<2)|0;if((k|0)>0){s=(k+ -1|0)>>>1;t=s<<1;u=h+ -2-t|0;v=n+ -4-(s<<2)|0;s=r;w=0;x=o;y=b+(n+1<<2)|0;while(1){n=x+ -16|0;z=s+ -8|0;A=+g[x+ -8>>2]+ +g[y>>2];B=+g[n>>2]+ +g[y+8>>2];C=s+ -4|0;g[m+(w+h<<2)>>2]=B*+g[C>>2]+A*+g[z>>2];g[m+((w|1)+h<<2)>>2]=B*+g[z>>2]-A*+g[C>>2];C=w+2|0;if((C|0)<(k|0)){y=y+16|0;x=n;w=C;s=z}else{break}}D=q+(u<<2)|0;E=t+2|0;F=b+(v<<2)|0}else{D=r;E=0;F=o}o=b+4|0;r=h-k|0;if((E|0)<(r|0)){k=D;v=E;t=F;F=o;while(1){u=k+ -8|0;s=t+ -16|0;A=+g[t+ -8>>2]- +g[F>>2];B=+g[s>>2]- +g[F+8>>2];w=k+ -4|0;g[m+(v+h<<2)>>2]=B*+g[w>>2]+A*+g[u>>2];g[m+((v|1)+h<<2)>>2]=B*+g[u>>2]-A*+g[w>>2];w=F+16|0;x=v+2|0;if((x|0)<(r|0)){F=w;t=s;v=x;k=u}else{G=u;H=x;I=w;break}}}else{G=D;H=E;I=o}if((H|0)<(h|0)){o=G;G=H;H=b+(f<<2)|0;f=I;while(1){I=o+ -8|0;b=H+ -16|0;A=-+g[H+ -8>>2]- +g[f>>2];B=-+g[b>>2]- +g[f+8>>2];E=o+ -4|0;g[m+(G+h<<2)>>2]=B*+g[E>>2]+A*+g[I>>2];g[m+((G|1)+h<<2)>>2]=B*+g[I>>2]-A*+g[E>>2];E=G+2|0;if((E|0)<(h|0)){f=f+16|0;H=b;G=E;o=I}else{break}}}vc(c[a+4>>2]|0,q,l,h);wc(c[a>>2]|0,c[p>>2]|0,c[a+12>>2]|0,m);if((j|0)<=0){i=e;return}l=a+16|0;a=(c[p>>2]|0)+(h<<2)|0;p=0;q=m;m=d+(h<<2)|0;while(1){h=m+ -4|0;o=q+4|0;G=a+4|0;g[d+(p<<2)>>2]=+g[l>>2]*(+g[q>>2]*+g[a>>2]+ +g[o>>2]*+g[G>>2]);g[h>>2]=+g[l>>2]*(+g[q>>2]*+g[G>>2]- +g[o>>2]*+g[a>>2]);o=p+1|0;if((o|0)<(j|0)){m=h;q=q+8|0;p=o;a=a+8|0}else{break}}i=e;return}function yc(a){a=a|0;var b=0;b=i;if((a|0)!=0){Ze(a)}i=b;return}function zc(a){a=a|0;var b=0;b=i;if((a|0)!=0){Ze(a)}i=b;return}function Ac(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0,l=0.0,m=0.0,n=0.0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0.0,w=0.0,x=0,y=0,z=0.0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0;h=i;j=a+0|0;k=j+48|0;do{c[j>>2]=0;j=j+4|0}while((j|0)<(k|0));c[a+36>>2]=c[d>>2];j=c[d>>2]|0;d=~~(+Ja(+(+Z(+(+(j|0)*8.0))*1.4426950408889634))+-1.0);c[a+32>>2]=d;l=+(f|0);m=+(e|0);n=+(1<<d+1|0);d=~~((+Z(+(l*.25*.5/m))*1.4426950216293335+-5.965784072875977)*n- +(j|0));c[a+28>>2]=d;c[a+40>>2]=1-d+~~((+Z(+((+(e|0)+.25)*l*.5/m))*1.4426950216293335+-5.965784072875977)*n+.5);d=e<<2;j=Ye(d)|0;c[a+16>>2]=j;k=Ye(d)|0;c[a+20>>2]=k;o=Ye(d)|0;c[a+24>>2]=o;p=a+4|0;c[p>>2]=b;c[a>>2]=e;c[a+44>>2]=f;q=a+48|0;g[q>>2]=1.0;do{if((f|0)<26e3){g[q>>2]=0.0}else{if((f|0)<38e3){g[q>>2]=.9399999976158142;break}if((f|0)<=46e3){break}g[q>>2]=1.274999976158142}}while(0);l=+(f|0);q=0;r=0;a:while(1){s=q;while(1){if((s|0)>=87){break a}t=s+1|0;u=~~+Ja(+(m*+Y(+(+(t|0)*.08664337545633316+2.7488713472395148))*2.0/l));v=+g[3680+(s<<2)>>2];if((r|0)<(u|0)){break}else{s=t}}w=(+g[3680+(t<<2)>>2]-v)/+(u-r|0);if((r|0)>=(e|0)){q=t;r=r;continue}s=r-u|0;x=r-e|0;y=s>>>0>x>>>0?s:x;z=v;x=r;while(1){g[j+(x<<2)>>2]=z+100.0;s=x+1|0;if((s|0)<(u|0)&(s|0)<(e|0)){x=s;z=w+z}else{break}}q=t;r=r-y|0}if((r|0)<(e|0)){t=r;do{g[j+(t<<2)>>2]=+g[j+(t+ -1<<2)>>2];t=t+1|0;}while((t|0)<(e|0))}t=(e|0)>0;do{if(t){j=(f|0)/(e<<1|0)|0;r=c[b+120>>2]|0;q=b+124|0;u=b+116|0;x=b+112|0;s=1;A=0;B=-99;while(1){C=$(j,A)|0;v=+(C|0);z=+W(+(v*.0007399999885819852))*13.100000381469727+ +W(+(+($(C,C)|0)*1.8499999754340024e-8))*2.240000009536743+v*9999999747378752.0e-20;b:do{if((r+B|0)<(A|0)){v=z- +g[x>>2];C=B;while(1){D=$(C,j)|0;w=+(D|0);E=C+1|0;if(!(w*9999999747378752.0e-20+(+W(+(w*.0007399999885819852))*13.100000381469727+ +W(+(+($(D,D)|0)*1.8499999754340024e-8))*2.240000009536743)<v)){F=C;break b}if((r+E|0)<(A|0)){C=E}else{F=E;break}}}else{F=B}}while(0);c:do{if((s|0)>(e|0)){G=s}else{C=(c[q>>2]|0)+A|0;E=s;while(1){if((E|0)>=(C|0)){D=$(E,j)|0;v=+(D|0);w=v*9999999747378752.0e-20+(+W(+(v*.0007399999885819852))*13.100000381469727+ +W(+(+($(D,D)|0)*1.8499999754340024e-8))*2.240000009536743);if(!(w<z+ +g[u>>2])){G=E;break c}}D=E+1|0;if((E|0)<(e|0)){E=D}else{G=D;break}}}}while(0);c[o+(A<<2)>>2]=(F<<16)+ -65537+G;E=A+1|0;if((E|0)<(e|0)){s=G;A=E;B=F}else{break}}if(t){H=0}else{break}do{c[k+(H<<2)>>2]=~~((+Z(+(l*(+(H|0)+.25)*.5/m))*1.4426950216293335+-5.965784072875977)*n+.5);H=H+1|0;}while((H|0)<(e|0))}}while(0);c[a+8>>2]=Bc(b+36|0,l*.5/m,e,+g[b+24>>2],+g[b+28>>2])|0;b=Ye(12)|0;c[a+12>>2]=b;a=Ye(d)|0;c[b>>2]=a;H=Ye(d)|0;c[b+4>>2]=H;k=Ye(d)|0;c[b+8>>2]=k;if(!t){i=h;return}n=m*2.0;t=c[p>>2]|0;p=0;do{m=+Z(+(l*(+(p|0)+.5)/n))*2.885390043258667+-11.931568145751953;z=m<0.0?0.0:m;m=!(z>=16.0)?z:16.0;b=~~m;z=m- +(b|0);m=1.0-z;d=b+1|0;g[a+(p<<2)>>2]=m*+g[t+132+(b<<2)>>2]+z*+g[t+132+(d<<2)>>2];g[H+(p<<2)>>2]=m*+g[t+200+(b<<2)>>2]+z*+g[t+200+(d<<2)>>2];g[k+(p<<2)>>2]=m*+g[t+268+(b<<2)>>2]+z*+g[t+268+(d<<2)>>2];p=p+1|0;}while((p|0)<(e|0));i=h;return}function Bc(a,b,d,e,f){a=a|0;b=+b;d=d|0;e=+e;f=+f;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0.0,w=0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,O=0,P=0,Q=0,R=0,S=0;h=i;i=i+32480|0;j=h;k=j;l=h+224|0;m=l;n=h+30688|0;o=i;i=i+((1*(d<<2)|0)+7&-8)|0;p=o;o=Ye(68)|0;hf(l|0,0,30464)|0;l=e>0.0;q=e<0.0;r=0;do{s=r<<2;t=0;do{u=t+s|0;if((u|0)<88){v=+g[3680+(u<<2)>>2]}else{v=-30.0}w=u+1|0;do{if((w|0)<88){x=+g[3680+(w<<2)>>2];if(!(v>x)){y=v;break}y=x}else{if(!(v>-30.0)){y=v;break}y=-30.0}}while(0);w=u+2|0;do{if((w|0)<88){x=+g[3680+(w<<2)>>2];if(!(y>x)){z=y;break}z=x}else{if(!(y>-30.0)){z=y;break}z=-30.0}}while(0);w=u+3|0;do{if((w|0)<88){x=+g[3680+(w<<2)>>2];if(!(z>x)){A=z;break}A=x}else{if(!(z>-30.0)){A=z;break}A=-30.0}}while(0);g[k+(t<<2)>>2]=A;t=t+1|0;}while((t|0)<56);t=5200+(r*1344|0)|0;ff(m+(r*1792|0)+448|0,t|0,224)|0;ff(m+(r*1792|0)+672|0,5424+(r*1344|0)|0,224)|0;ff(m+(r*1792|0)+896|0,5648+(r*1344|0)|0,224)|0;ff(m+(r*1792|0)+1120|0,5872+(r*1344|0)|0,224)|0;ff(m+(r*1792|0)+1344|0,6096+(r*1344|0)|0,224)|0;ff(m+(r*1792|0)+1568|0,6320+(r*1344|0)|0,224)|0;ff(m+(r*1792|0)|0,t|0,224)|0;ff(m+(r*1792|0)+224|0,t|0,224)|0;if(l){t=0;do{if(q){s=0;do{w=16-s|0;x=+(((w|0)>-1?w:0-w|0)|0)*f+e;B=x<0.0?0.0:x;w=m+(r*1792|0)+(t*224|0)+(s<<2)|0;g[w>>2]=(B>0.0?0.0:B)+ +g[w>>2];s=s+1|0;}while((s|0)<56)}else{s=0;do{w=16-s|0;B=+(((w|0)>-1?w:0-w|0)|0)*f+e;w=m+(r*1792|0)+(t*224|0)+(s<<2)|0;g[w>>2]=(B<0.0?0.0:B)+ +g[w>>2];s=s+1|0;}while((s|0)<56)}t=t+1|0;}while((t|0)<8)}else{t=0;do{if(q){s=0;do{w=16-s|0;B=+(((w|0)>-1?w:0-w|0)|0)*f+e;w=m+(r*1792|0)+(t*224|0)+(s<<2)|0;g[w>>2]=(B>0.0?0.0:B)+ +g[w>>2];s=s+1|0;}while((s|0)<56)}else{s=0;do{w=16-s|0;u=m+(r*1792|0)+(t*224|0)+(s<<2)|0;g[u>>2]=+(((w|0)>-1?w:0-w|0)|0)*f+e+ +g[u>>2];s=s+1|0;}while((s|0)<56)}t=t+1|0;}while((t|0)<8)}B=+g[a+(r<<2)>>2]+100.0;t=0;while(1){x=B-((t|0)<2?20.0:+(t|0)*10.0)+-30.0;s=0;do{u=m+(r*1792|0)+(t*224|0)+(s<<2)|0;g[u>>2]=x+ +g[u>>2];s=s+1|0;}while((s|0)<56);ff(n+(t*224|0)|0,j|0,224)|0;x=100.0- +(t|0)*10.0+-30.0;s=0;while(1){u=n+(t*224|0)+(s<<2)|0;g[u>>2]=x+ +g[u>>2];u=s+1|0;if((u|0)<56){s=u}else{C=0;break}}do{x=+g[m+(r*1792|0)+(t*224|0)+(C<<2)>>2];s=n+(t*224|0)+(C<<2)|0;if(x>+g[s>>2]){g[s>>2]=x}C=C+1|0;}while((C|0)<56);s=t+1|0;if((s|0)<8){t=s}else{D=1;break}}do{t=D+ -1|0;s=0;while(1){B=+g[n+(t*224|0)+(s<<2)>>2];u=n+(D*224|0)+(s<<2)|0;if(B<+g[u>>2]){g[u>>2]=B}u=s+1|0;if((u|0)<56){s=u}else{E=0;break}}do{B=+g[n+(D*224|0)+(E<<2)>>2];s=m+(r*1792|0)+(D*224|0)+(E<<2)|0;if(B<+g[s>>2]){g[s>>2]=B}E=E+1|0;}while((E|0)<56);D=D+1|0;}while((D|0)<8);r=r+1|0;}while((r|0)<17);e=b;r=(d|0)>0;D=~d;E=0;do{n=Ye(32)|0;c[o+(E<<2)>>2]=n;f=+(E|0);A=f*.5;C=~~+N(+(+Y(+(f*.34657350182533264+4.135165354540845))/e));j=~~+_(+(+Z(+(+(C|0)*b+1.0))*2.885390043258667+-11.931568145751953));a=~~+N(+(+Z(+(+(C+1|0)*b))*2.885390043258667+-11.931568145751953));C=(j|0)>(E|0)?E:j;j=(C|0)<0?0:C;C=(a|0)>16?16:a;a=(j|0)>(C|0);E=E+1|0;q=(E|0)<17;l=0;do{k=Ye(232)|0;c[n+(l<<2)>>2]=k;if(r){s=0;do{g[p+(s<<2)>>2]=999.0;s=s+1|0;}while((s|0)<(d|0))}if(!a){s=j;while(1){f=+(s|0)*.5;t=0;u=0;while(1){z=f+ +(t|0)*.125;w=~~(+Y(+((z+3.9032840728759766)*.6931470036506653))/e);F=~~(+Y(+((z+4.028284072875977)*.6931470036506653))/e+1.0);G=(w|0)<0?0:w;H=(G|0)>(d|0)?d:G;G=(H|0)<(u|0)?H:u;H=(F|0)<0?0:F;I=(H|0)>(d|0)?d:H;if((G|0)<(I|0)&(G|0)<(d|0)){z=+g[m+(s*1792|0)+(l*224|0)+(t<<2)>>2];H=~u;J=(H|0)>(D|0)?H:D;H=(w|0)>0?~w:-1;w=(J|0)>(H|0)?J:H;H=(F|0)>0?~F:-1;F=((H|0)<(D|0)?D:H)-w|0;H=~(w+d);J=F>>>0>H>>>0?F:H;H=G;do{F=p+(H<<2)|0;if(+g[F>>2]>z){g[F>>2]=z}H=H+1|0;}while((H|0)<(I|0)&(H|0)<(d|0));K=~w-J|0}else{K=G}H=t+1|0;if((H|0)<56){t=H;u=K}else{break}}if((K|0)<(d|0)){f=+g[m+(s*1792|0)+(l*224|0)+220>>2];u=K;do{t=p+(u<<2)|0;if(+g[t>>2]>f){g[t>>2]=f}u=u+1|0;}while((u|0)<(d|0))}if((s|0)<(C|0)){s=s+1|0}else{break}}}do{if(q){s=0;u=0;while(1){f=A+ +(s|0)*.125;t=~~(+Y(+((f+3.9032840728759766)*.6931470036506653))/e);H=~~(+Y(+((f+4.028284072875977)*.6931470036506653))/e+1.0);I=(t|0)<0?0:t;F=(I|0)>(d|0)?d:I;I=(F|0)<(u|0)?F:u;F=(H|0)<0?0:H;L=(F|0)>(d|0)?d:F;if((I|0)<(L|0)&(I|0)<(d|0)){f=+g[m+(E*1792|0)+(l*224|0)+(s<<2)>>2];F=~u;M=(F|0)>(D|0)?F:D;F=(t|0)>0?~t:-1;t=(M|0)>(F|0)?M:F;F=(H|0)>0?~H:-1;H=((F|0)<(D|0)?D:F)-t|0;F=~(t+d);M=H>>>0>F>>>0?H:F;F=I;do{H=p+(F<<2)|0;if(+g[H>>2]>f){g[H>>2]=f}F=F+1|0;}while((F|0)<(L|0)&(F|0)<(d|0));O=~t-M|0}else{O=I}F=s+1|0;if((F|0)<56){s=F;u=O}else{break}}if((O|0)>=(d|0)){P=0;break}f=+g[m+(E*1792|0)+(l*224|0)+220>>2];u=O;while(1){s=p+(u<<2)|0;if(+g[s>>2]>f){g[s>>2]=f}s=u+1|0;if((s|0)<(d|0)){u=s}else{P=0;break}}}else{P=0}}while(0);while(1){u=~~(+Y(+((A+ +(P|0)*.125+3.9657840728759766)*.6931470036506653))/e);do{if((u|0)<0){g[k+(P+2<<2)>>2]=-999.0}else{if((u|0)<(d|0)){g[k+(P+2<<2)>>2]=+g[p+(u<<2)>>2];break}else{g[k+(P+2<<2)>>2]=-999.0;break}}}while(0);u=P+1|0;if((u|0)<56){P=u}else{Q=0;break}}while(1){u=Q+1|0;if(+g[k+(Q+2<<2)>>2]>-200.0){R=Q;break}if((u|0)<16){Q=u}else{R=u;break}}g[k>>2]=+(R|0);u=55;while(1){s=u+ -1|0;if(+g[k+(u+2<<2)>>2]>-200.0){S=u;break}if((s|0)>17){u=s}else{S=s;break}}g[k+4>>2]=+(S|0);l=l+1|0;}while((l|0)<8)}while(q);i=h;return o|0}function Cc(a){a=a|0;var b=0,d=0,e=0,f=0;b=i;if((a|0)==0){i=b;return}d=c[a+16>>2]|0;if((d|0)!=0){Ze(d)}d=c[a+20>>2]|0;if((d|0)!=0){Ze(d)}d=c[a+24>>2]|0;if((d|0)!=0){Ze(d)}d=a+8|0;e=c[d>>2]|0;if((e|0)!=0){f=e;e=0;do{Ze(c[c[f+(e<<2)>>2]>>2]|0);Ze(c[(c[(c[d>>2]|0)+(e<<2)>>2]|0)+4>>2]|0);Ze(c[(c[(c[d>>2]|0)+(e<<2)>>2]|0)+8>>2]|0);Ze(c[(c[(c[d>>2]|0)+(e<<2)>>2]|0)+12>>2]|0);Ze(c[(c[(c[d>>2]|0)+(e<<2)>>2]|0)+16>>2]|0);Ze(c[(c[(c[d>>2]|0)+(e<<2)>>2]|0)+20>>2]|0);Ze(c[(c[(c[d>>2]|0)+(e<<2)>>2]|0)+24>>2]|0);Ze(c[(c[(c[d>>2]|0)+(e<<2)>>2]|0)+28>>2]|0);Ze(c[(c[d>>2]|0)+(e<<2)>>2]|0);e=e+1|0;f=c[d>>2]|0}while((e|0)<17);Ze(f)}f=a+12|0;e=c[f>>2]|0;if((e|0)!=0){Ze(c[e>>2]|0);Ze(c[(c[f>>2]|0)+4>>2]|0);Ze(c[(c[f>>2]|0)+8>>2]|0);Ze(c[f>>2]|0)}f=a+0|0;a=f+52|0;do{c[f>>2]=0;f=f+4|0}while((f|0)<(a|0));i=b;return}function Dc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0;e=i;f=c[a>>2]|0;h=i;i=i+((1*(f<<2)|0)+7&-8)|0;j=h;h=a+24|0;Ec(f,c[h>>2]|0,b,d,140.0,-1);k=(f|0)>0;if(k){l=0;do{g[j+(l<<2)>>2]=+g[b+(l<<2)>>2]- +g[d+(l<<2)>>2];l=l+1|0;}while((l|0)<(f|0))}l=a+4|0;Ec(f,c[h>>2]|0,j,d,0.0,c[(c[l>>2]|0)+128>>2]|0);if(k){m=0}else{i=e;return}do{h=j+(m<<2)|0;g[h>>2]=+g[b+(m<<2)>>2]- +g[h>>2];m=m+1|0;}while((m|0)<(f|0));if(!k){i=e;return}k=c[l>>2]|0;l=0;do{m=d+(l<<2)|0;b=~~(+g[m>>2]+.5);h=(b|0)>39?39:b;g[m>>2]=+g[j+(l<<2)>>2]+ +g[k+336+(((h|0)<0?0:h)<<2)>>2];l=l+1|0;}while((l|0)<(f|0));i=e;return}function Ec(a,b,d,e,f,h){a=a|0;b=b|0;d=d|0;e=e|0;f=+f;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0,I=0.0,J=0.0,K=0.0,L=0,M=0.0,N=0.0,O=0.0,P=0.0,Q=0,R=0.0,S=0.0,T=0.0,U=0.0,V=0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0.0,$=0.0,aa=0.0,ba=0.0,ca=0.0,da=0.0,ea=0,fa=0.0,ga=0,ha=0.0;j=i;k=a<<2;l=i;i=i+((1*k|0)+7&-8)|0;m=l;n=i;i=i+((1*k|0)+7&-8)|0;o=n;p=i;i=i+((1*k|0)+7&-8)|0;q=p;r=i;i=i+((1*k|0)+7&-8)|0;s=r;t=i;i=i+((1*k|0)+7&-8)|0;k=t;u=+g[d>>2]+f;v=u<1.0?1.0:u;u=v*v*.5;w=v*u;g[l>>2]=u;g[n>>2]=u;g[p>>2]=0.0;g[r>>2]=w;g[t>>2]=0.0;if((a|0)>1){t=1;v=u;x=0.0;y=0.0;z=u;u=w;w=1.0;while(1){A=+g[d+(t<<2)>>2]+f;B=A<1.0?1.0:A;A=B*B;C=v+A;D=w*A;E=z+D;F=x+w*D;G=u+B*A;A=y+B*D;g[m+(t<<2)>>2]=C;g[o+(t<<2)>>2]=E;g[q+(t<<2)>>2]=F;g[s+(t<<2)>>2]=G;g[k+(t<<2)>>2]=A;r=t+1|0;if((r|0)<(a|0)){w=w+1.0;u=G;z=E;y=A;x=F;v=C;t=r}else{break}}}t=c[b>>2]|0;d=t>>16;if((d|0)>-1){H=t;I=0.0;J=0.0;K=1.0;L=0;M=0.0}else{r=d;d=t;t=0;v=0.0;while(1){p=d&65535;n=0-r|0;x=+g[m+(p<<2)>>2]+ +g[m+(n<<2)>>2];y=+g[o+(p<<2)>>2]- +g[o+(n<<2)>>2];z=+g[q+(p<<2)>>2]+ +g[q+(n<<2)>>2];u=+g[s+(p<<2)>>2]+ +g[s+(n<<2)>>2];w=+g[k+(p<<2)>>2]- +g[k+(n<<2)>>2];C=z*u-y*w;F=x*w-y*u;u=x*z-y*y;y=(C+v*F)/u;g[e+(t<<2)>>2]=(y<0.0?0.0:y)-f;n=t+1|0;y=v+1.0;p=c[b+(n<<2)>>2]|0;l=p>>16;if((l|0)>-1){H=p;I=C;J=F;K=u;L=n;M=y;break}else{v=y;t=n;d=p;r=l}}}r=H&65535;if((r|0)<(a|0)){d=r;r=H;H=L;v=M;while(1){t=r>>16;y=+g[m+(d<<2)>>2]- +g[m+(t<<2)>>2];u=+g[o+(d<<2)>>2]- +g[o+(t<<2)>>2];F=+g[q+(d<<2)>>2]- +g[q+(t<<2)>>2];C=+g[s+(d<<2)>>2]- +g[s+(t<<2)>>2];z=+g[k+(d<<2)>>2]- +g[k+(t<<2)>>2];x=F*C-u*z;w=y*z-u*C;C=y*F-u*u;u=(x+v*w)/C;g[e+(H<<2)>>2]=(u<0.0?0.0:u)-f;t=H+1|0;u=v+1.0;l=c[b+(t<<2)>>2]|0;p=l&65535;if((p|0)<(a|0)){v=u;H=t;r=l;d=p}else{N=x;O=w;P=C;Q=t;R=u;break}}}else{N=I;O=J;P=K;Q=L;R=M}if((Q|0)<(a|0)){L=Q;M=R;while(1){R=(N+O*M)/P;g[e+(L<<2)>>2]=(R<0.0?0.0:R)-f;Q=L+1|0;if((Q|0)<(a|0)){M=M+1.0;L=Q}else{break}}}if((h|0)<1){i=j;return}L=(h|0)/2|0;Q=L-h|0;if((Q|0)>-1){S=N;T=O;U=P;V=0;W=0.0}else{d=Q;Q=L;r=0;P=0.0;do{H=0-d|0;O=+g[m+(Q<<2)>>2]+ +g[m+(H<<2)>>2];N=+g[o+(Q<<2)>>2]- +g[o+(H<<2)>>2];M=+g[q+(Q<<2)>>2]+ +g[q+(H<<2)>>2];R=+g[s+(Q<<2)>>2]+ +g[s+(H<<2)>>2];K=+g[k+(Q<<2)>>2]- +g[k+(H<<2)>>2];X=M*R-N*K;Y=O*K-N*R;Z=O*M-N*N;N=(X+P*Y)/Z-f;H=e+(r<<2)|0;if(N<+g[H>>2]){g[H>>2]=N}r=r+1|0;P=P+1.0;Q=L+r|0;d=Q-h|0;}while(!((d|0)>-1));S=X;T=Y;U=Z;V=h-L|0;W=P}d=V+L|0;if((d|0)<(a|0)){Q=d;d=V;P=W;do{r=Q-h|0;Z=+g[m+(Q<<2)>>2]- +g[m+(r<<2)>>2];Y=+g[o+(Q<<2)>>2]- +g[o+(r<<2)>>2];X=+g[q+(Q<<2)>>2]- +g[q+(r<<2)>>2];N=+g[s+(Q<<2)>>2]- +g[s+(r<<2)>>2];M=+g[k+(Q<<2)>>2]- +g[k+(r<<2)>>2];_=X*N-Y*M;$=Z*M-Y*N;aa=Z*X-Y*Y;Y=(_+P*$)/aa-f;r=e+(d<<2)|0;if(Y<+g[r>>2]){g[r>>2]=Y}d=d+1|0;P=P+1.0;Q=d+L|0;}while((Q|0)<(a|0));ba=_;ca=$;da=aa;ea=a-L|0;fa=P}else{ba=S;ca=T;da=U;ea=V;fa=W}if((ea|0)<(a|0)){ga=ea;ha=fa}else{i=j;return}while(1){fa=(ba+ca*ha)/da-f;ea=e+(ga<<2)|0;if(fa<+g[ea>>2]){g[ea>>2]=fa}ea=ga+1|0;if((ea|0)<(a|0)){ga=ea;ha=ha+1.0}else{break}}i=j;return}function Fc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=+e;f=+f;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0.0,q=0,r=0.0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0.0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0.0,N=0.0,O=0,P=0,Q=0,R=0;h=i;j=c[a>>2]|0;k=a+40|0;l=c[k>>2]|0;m=i;i=i+((1*(l<<2)|0)+7&-8)|0;n=m;m=a+4|0;o=c[m>>2]|0;p=+g[o+4>>2]+f;if((l|0)>0){q=0;do{g[n+(q<<2)>>2]=-9999.0;q=q+1|0;}while((q|0)<(l|0))}f=+g[o+8>>2];r=p<f?f:p;q=(j|0)>0;do{if(q){s=c[a+16>>2]|0;t=0;do{g[d+(t<<2)>>2]=r+ +g[s+(t<<2)>>2];t=t+1|0;}while((t|0)<(j|0));t=c[a+8>>2]|0;p=+g[o+496>>2]-e;if(!q){u=7;break}s=c[a+20>>2]|0;v=a+32|0;w=a+36|0;x=a+28|0;y=0;while(1){z=c[s+(y<<2)>>2]|0;A=y;f=+g[b+(y<<2)>>2];a:while(1){B=A;while(1){C=B+1|0;if((C|0)>=(j|0)){D=0;break a}if((c[s+(C<<2)>>2]|0)!=(z|0)){D=1;break a}E=+g[b+(C<<2)>>2];if(E>f){A=C;f=E;continue a}else{B=C}}}do{if(f+6.0>+g[d+(B<<2)>>2]){A=z>>c[v>>2];F=(A|0)>16?16:A;A=c[w>>2]|0;G=~~((p+f+-30.0)*.10000000149011612);H=(G|0)<0?0:G;G=c[(c[t+(((F|0)<0?0:F)<<2)>>2]|0)+(((H|0)>7?7:H)<<2)>>2]|0;H=~~+g[G+4>>2];E=+g[G>>2];F=~~E;if((F|0)>=(H|0)){break}I=F;F=~~(+(A|0)*(E+-16.0)+ +((c[s+(B<<2)>>2]|0)-(c[x>>2]|0)|0)- +(A>>1|0));do{do{if((F|0)>0){E=f+ +g[G+(I+2<<2)>>2];J=n+(F<<2)|0;if(!(+g[J>>2]<E)){break}g[J>>2]=E}}while(0);F=F+A|0;I=I+1|0;}while((F|0)<(l|0)&(I|0)<(H|0))}}while(0);if(D){y=C}else{K=w;break}}}else{u=7}}while(0);if((u|0)==7){K=a+36|0}u=c[K>>2]|0;Kc(n,u,l);l=c[a>>2]|0;b:do{if((l|0)>1){K=c[a+20>>2]|0;C=c[K>>2]|0;D=c[a+28>>2]|0;B=(c[m>>2]|0)+32|0;b=C;j=1;q=0;o=C-(u>>1)-D|0;while(1){e=+g[n+(o<<2)>>2];C=((c[K+(j<<2)>>2]|0)+b>>1)-D|0;r=+g[B>>2];p=e>r?r:e;c:do{if((o|0)<(C|0)){w=o;e=p;while(1){y=e==-9999.0;x=w;while(1){L=x+1|0;M=+g[n+(L<<2)>>2];if(M>-9999.0){if(M<e|y){break}}else{if(y){break}}if((L|0)<(C|0)){x=L}else{N=e;O=L;break c}}if((L|0)<(C|0)){w=L;e=M}else{N=M;O=L;break}}}else{N=p;O=o}}while(0);C=O+D|0;d:do{if((q|0)>=(l|0)|(b|0)>(C|0)){P=q}else{w=q;while(1){x=d+(w<<2)|0;if(+g[x>>2]<N){g[x>>2]=N}x=w+1|0;if((x|0)>=(l|0)){P=x;break d}if((c[K+(x<<2)>>2]|0)>(C|0)){P=x;break}else{w=x}}}}while(0);C=P+1|0;if((C|0)>=(l|0)){Q=P;break b}b=c[K+(P<<2)>>2]|0;j=C;q=P;o=O}}else{Q=0}}while(0);N=+g[n+((c[k>>2]|0)+ -1<<2)>>2];if((Q|0)<(l|0)){R=Q}else{i=h;return}do{Q=d+(R<<2)|0;if(+g[Q>>2]<N){g[Q>>2]=N}R=R+1|0;}while((R|0)<(l|0));i=h;return}function Gc(a,b,d,e,f,h,j){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0.0,o=0,p=0,q=0.0,r=0.0,s=0.0,t=0.0,u=0.0;k=i;l=c[a>>2]|0;m=c[a+4>>2]|0;n=+g[m+12+(e<<2)>>2];if((l|0)<=0){i=k;return}o=c[(c[a+12>>2]|0)+(e<<2)>>2]|0;p=m+108|0;m=(e|0)==1;q=+g[a+48>>2];a=0;do{r=+g[b+(a<<2)>>2]+ +g[o+(a<<2)>>2];s=+g[p>>2];t=r>s?s:r;r=n+ +g[d+(a<<2)>>2];g[f+(a<<2)>>2]=t<r?r:t;if(m){r=t- +g[j+(a<<2)>>2];t=r+17.200000762939453;do{if(r>-17.200000762939453){s=1.0-q*t*.005;if(!(s<0.0)){u=s;break}u=9999999747378752.0e-20}else{u=1.0-q*t*3.0e-4}}while(0);e=h+(a<<2)|0;g[e>>2]=u*+g[e>>2]}a=a+1|0;}while((a|0)<(l|0));i=k;return}function Hc(a,b,d,e,f,j,k,l,m){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;j=j|0;k=k|0;l=l|0;m=m|0;var n=0,o=0,p=0,q=0,r=0,s=0.0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0.0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,P=0,Q=0,R=0,S=0.0,T=0,U=0.0,V=0,W=0,X=0,Y=0,Z=0,_=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0.0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0;n=i;o=c[d>>2]|0;p=d+4|0;d=c[p>>2]|0;if((c[d+500>>2]|0)==0){q=16}else{q=c[d+508>>2]|0}r=c[b+132+((c[d>>2]|0)*60|0)+(a<<2)>>2]|0;s=+h[4032+(c[b+252+(a<<2)>>2]<<3)>>3];d=m<<2;t=i;i=i+((1*d|0)+7&-8)|0;u=t;v=i;i=i+((1*d|0)+7&-8)|0;w=v;x=i;i=i+((1*d|0)+7&-8)|0;y=x;z=i;i=i+((1*d|0)+7&-8)|0;A=z;B=i;i=i+((1*d|0)+7&-8)|0;C=B;D=e+1156|0;E=+h[((o|0)>1e3?4104:4032)+(c[b+312+(a<<2)>>2]<<3)>>3];a=$(d,q)|0;b=i;i=i+((1*a|0)+7&-8)|0;F=b;c[t>>2]=F;b=i;i=i+((1*a|0)+7&-8)|0;G=b;c[v>>2]=G;b=i;i=i+((1*a|0)+7&-8)|0;H=b;c[x>>2]=H;b=i;i=i+((1*a|0)+7&-8)|0;I=b;c[z>>2]=I;a:do{if((m|0)>1){b=I;J=H;K=G;L=F;M=1;while(1){N=$(M,q)|0;c[u+(M<<2)>>2]=L+(N<<2);c[w+(M<<2)>>2]=K+(N<<2);c[y+(M<<2)>>2]=J+(N<<2);c[A+(M<<2)>>2]=b+(N<<2);N=M+1|0;if((N|0)>=(m|0)){break a}b=c[z>>2]|0;J=c[x>>2]|0;K=c[v>>2]|0;L=c[t>>2]|0;M=N}}}while(0);t=c[D>>2]|0;if((o|0)>0){v=c[z>>2]|0;z=(m|0)>0;x=0;while(1){F=o-x|0;G=(q|0)>(F|0)?F:q;ff(B|0,k|0,d|0)|0;hf(v|0,0,a|0)|0;if(z){F=(G|0)>0;H=r-x|0;I=0;do{M=c[j+(I<<2)>>2]|0;L=M+(x<<2)|0;do{if((c[C+(I<<2)>>2]|0)==0){if(!F){break}K=c[y+(I<<2)>>2]|0;J=c[u+(I<<2)>>2]|0;b=c[w+(I<<2)>>2]|0;N=c[A+(I<<2)>>2]|0;P=0;do{g[K+(P<<2)>>2]=1.000000013351432e-10;g[J+(P<<2)>>2]=0.0;g[b+(P<<2)>>2]=0.0;c[N+(P<<2)>>2]=0;c[M+(P+x<<2)>>2]=0;P=P+1|0;}while((P|0)<(G|0))}else{P=c[y+(I<<2)>>2]|0;do{if(F){N=0;do{g[P+(N<<2)>>2]=+g[4176+(c[M+(N+x<<2)>>2]<<2)>>2];N=N+1|0;}while((N|0)<(G|0));N=c[f+(I<<2)>>2]|0;b=c[A+(I<<2)>>2]|0;if(F){Q=0}else{R=19;break}do{S=+O(+(+g[N+(Q+x<<2)>>2]));c[b+(Q<<2)>>2]=!(S/+g[P+(Q<<2)>>2]<((Q|0)>=(H|0)?E:s))&1;Q=Q+1|0;}while((Q|0)<(G|0));if(!F){R=19;break}b=c[u+(I<<2)>>2]|0;J=c[w+(I<<2)>>2]|0;K=0;while(1){T=N+(K+x<<2)|0;S=+g[T>>2];U=S*S;V=b+(K<<2)|0;g[V>>2]=U;g[J+(K<<2)>>2]=U;if(+g[T>>2]<0.0){g[V>>2]=+g[V>>2]*-1.0}V=P+(K<<2)|0;U=+g[V>>2];g[V>>2]=U*U;V=K+1|0;if((V|0)<(G|0)){K=V}else{W=J;X=b;break}}}else{R=19}}while(0);if((R|0)==19){R=0;W=c[w+(I<<2)>>2]|0;X=c[u+(I<<2)>>2]|0}+Ic(c[p>>2]|0,r,X,W,P,0,x,G,L)}}while(0);I=I+1|0;}while((I|0)<(m|0))}I=c[D>>2]|0;if((I|0)>0){F=(G|0)>0;H=l-x|0;L=r-x|0;M=I;b=0;while(1){J=c[e+1160+(b<<2)>>2]|0;K=c[e+2184+(b<<2)>>2]|0;N=c[j+(J<<2)>>2]|0;V=N+(x<<2)|0;T=c[j+(K<<2)>>2]|0;Y=c[u+(J<<2)>>2]|0;Z=c[u+(K<<2)>>2]|0;_=c[w+(J<<2)>>2]|0;aa=c[w+(K<<2)>>2]|0;ba=c[y+(J<<2)>>2]|0;ca=c[y+(K<<2)>>2]|0;da=c[A+(J<<2)>>2]|0;ea=c[A+(K<<2)>>2]|0;fa=C+(J<<2)|0;J=C+(K<<2)|0;if((c[fa>>2]|0)==0){if((c[J>>2]|0)==0){ga=M}else{R=31}}else{R=31}if((R|0)==31){R=0;c[J>>2]=1;c[fa>>2]=1;if(F){fa=0;do{b:do{if((fa|0)<(H|0)){J=da+(fa<<2)|0;K=ea+(fa<<2)|0;do{if((c[J>>2]|0)==0){if((c[K>>2]|0)!=0){break}do{if((fa|0)<(L|0)){ha=Y+(fa<<2)|0;U=+g[Z+(fa<<2)>>2]+ +g[ha>>2];g[ha>>2]=U;g[_+(fa<<2)>>2]=+O(+U)}else{ha=Y+(fa<<2)|0;U=+g[ha>>2];S=+g[Z+(fa<<2)>>2];ia=+O(+U)+ +O(+S);g[_+(fa<<2)>>2]=ia;if(U+S<0.0){g[ha>>2]=-ia;break}else{g[ha>>2]=ia;break}}}while(0);g[aa+(fa<<2)>>2]=0.0;g[Z+(fa<<2)>>2]=0.0;c[K>>2]=1;c[T+(fa+x<<2)>>2]=0;break b}}while(0);ha=Y+(fa<<2)|0;ia=+O(+(+g[ha>>2]));g[ha>>2]=ia+ +O(+(+g[Z+(fa<<2)>>2]));ha=_+(fa<<2)|0;g[ha>>2]=+g[ha>>2]+ +g[aa+(fa<<2)>>2];c[K>>2]=1;c[J>>2]=1;ha=fa+x|0;ja=N+(ha<<2)|0;ka=c[ja>>2]|0;la=T+(ha<<2)|0;ha=c[la>>2]|0;if((((ka|0)>-1?ka:0-ka|0)|0)>(((ha|0)>-1?ha:0-ha|0)|0)){ma=(ka|0)>0?ka-ha|0:ha-ka|0;c[la>>2]=ma;na=c[ja>>2]|0;oa=ma}else{c[la>>2]=(ha|0)>0?ka-ha|0:ha-ka|0;c[ja>>2]=ha;na=ha;oa=c[la>>2]|0}if((oa|0)<(((na|0)>-1?na:0-na|0)<<1|0)){break}c[la>>2]=0-oa;c[ja>>2]=0-(c[ja>>2]|0)}}while(0);P=ba+(fa<<2)|0;ja=ca+(fa<<2)|0;ia=+g[P>>2]+ +g[ja>>2];g[ja>>2]=ia;g[P>>2]=ia;fa=fa+1|0;}while((fa|0)<(G|0))}+Ic(c[p>>2]|0,r,Y,_,ba,da,x,G,V);ga=c[D>>2]|0}fa=b+1|0;if((fa|0)<(ga|0)){M=ga;b=fa}else{pa=ga;break}}}else{pa=I}b=x+q|0;if((b|0)<(o|0)){x=b}else{qa=pa;break}}}else{qa=t}if((qa|0)>0){ra=qa;sa=0}else{i=n;return}while(1){qa=k+(c[e+1160+(sa<<2)>>2]<<2)|0;t=e+2184+(sa<<2)|0;if((c[qa>>2]|0)==0){if((c[k+(c[t>>2]<<2)>>2]|0)==0){ta=ra}else{R=52}}else{R=52}if((R|0)==52){R=0;c[qa>>2]=1;c[k+(c[t>>2]<<2)>>2]=1;ta=c[D>>2]|0}t=sa+1|0;if((t|0)<(ta|0)){ra=ta;sa=t}else{break}}i=n;return}function Ic(a,b,d,e,f,j,l,m,n){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;j=j|0;l=l|0;m=m|0;n=n|0;var o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0,y=0.0,z=0.0,A=0,B=0.0,C=0.0,D=0.0,E=0,F=0.0;o=i;p=i;i=i+((1*(m<<2)|0)+7&-8)|0;q=p;if((c[a+500>>2]|0)==0){r=m}else{r=(c[a+504>>2]|0)-l|0}p=(r|0)>(m|0)?m:r;if((p|0)>0){s=(j|0)==0;t=~r;r=~m;u=(t|0)>(r|0)?t:r;r=0;do{if(s){v=10}else{if((c[j+(r<<2)>>2]|0)==0){v=10}}do{if((v|0)==10){v=0;t=+g[d+(r<<2)>>2]<0.0;w=+Ja(+(+P(+(+g[e+(r<<2)>>2]/+g[f+(r<<2)>>2]))));if(t){c[n+(r<<2)>>2]=~~-w;break}else{c[n+(r<<2)>>2]=~~w;break}}}while(0);r=r+1|0;}while((r|0)<(p|0));x=~u}else{x=0}if((x|0)>=(m|0)){y=0.0;i=o;return+y}u=(j|0)!=0;p=b-l|0;w=0.0;l=0;b=x;while(1){if(u){if((c[j+(b<<2)>>2]|0)==0){v=16}else{z=w;A=l}}else{v=16}a:do{if((v|0)==16){v=0;x=e+(b<<2)|0;B=+g[f+(b<<2)>>2];C=+g[x>>2]/B;do{if(C<.25){if(u&(b|0)<(p|0)){break}c[q+(l<<2)>>2]=x;z=w+C;A=l+1|0;break a}}while(0);r=+g[d+(b<<2)>>2]<0.0;D=+Ja(+(+P(+C)));if(r){r=~~-D;c[n+(b<<2)>>2]=r;E=r}else{r=~~D;c[n+(b<<2)>>2]=r;E=r}g[x>>2]=B*+($(E,E)|0);z=w;A=l}}while(0);r=b+1|0;if((r|0)<(m|0)){w=z;l=A;b=r}else{break}}if((A|0)==0){y=z;i=o;return+y}Ya(q|0,A|0,4,11);if((A|0)<=0){y=z;i=o;return+y}w=+h[a+512>>3];D=z;a=0;while(1){b=(c[q+(a<<2)>>2]|0)-e>>2;if(!(D>=w)){c[n+(b<<2)>>2]=0;g[e+(b<<2)>>2]=0.0;F=D}else{c[n+(b<<2)>>2]=~~(c[k>>2]=(g[k>>2]=+g[d+(b<<2)>>2],c[k>>2]|0)&-2147483648|1065353216,+g[k>>2]);g[e+(b<<2)>>2]=+g[f+(b<<2)>>2];F=D+-1.0}b=a+1|0;if((b|0)<(A|0)){D=F;a=b}else{y=F;break}}i=o;return+y}function Jc(a,b){a=a|0;b=b|0;var d=0.0,e=0.0;d=+g[c[a>>2]>>2];e=+g[c[b>>2]>>2];i=i;return(d<e)-(d>e)|0}function Kc(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0.0,o=0,p=0.0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;e=i;f=d<<2;h=i;i=i+((1*f|0)+7&-8)|0;j=h;h=i;i=i+((1*f|0)+7&-8)|0;f=h;if((d|0)>0){k=0;l=0}else{i=e;return}do{do{if((l|0)<2){c[j+(l<<2)>>2]=k;g[f+(l<<2)>>2]=+g[a+(k<<2)>>2];m=l}else{n=+g[a+(k<<2)>>2];h=l;while(1){o=h+ -1|0;p=+g[f+(o<<2)>>2];if(n<p){q=8;break}if(!((k|0)<((c[j+(o<<2)>>2]|0)+b|0)&(h|0)>1)){q=12;break}r=h+ -2|0;if(!(p<=+g[f+(r<<2)>>2])){q=12;break}if((k|0)<((c[j+(r<<2)>>2]|0)+b|0)){h=o}else{q=12;break}}if((q|0)==8){q=0;c[j+(h<<2)>>2]=k;g[f+(h<<2)>>2]=n;m=h;break}else if((q|0)==12){q=0;c[j+(h<<2)>>2]=k;g[f+(h<<2)>>2]=n;m=h;break}}}while(0);l=m+1|0;k=k+1|0;}while((k|0)<(d|0));if(!((m|0)>-1)){i=e;return}k=b+1|0;b=~d;o=0;r=0;while(1){do{if((o|0)<(m|0)){s=o+1|0;if(!(+g[f+(s<<2)>>2]>+g[f+(o<<2)>>2])){q=17;break}t=c[j+(s<<2)>>2]|0}else{q=17}}while(0);if((q|0)==17){q=0;t=k+(c[j+(o<<2)>>2]|0)|0}s=(t|0)>(d|0)?d:t;if((r|0)<(s|0)){p=+g[f+(o<<2)>>2];u=~t;v=(u|0)>(b|0)?u:b;u=r;do{g[a+(u<<2)>>2]=p;u=u+1|0;}while((u|0)<(s|0));w=~v}else{w=r}s=o+1|0;if((s|0)<(l|0)){o=s;r=w}else{break}}i=e;return}function Lc(a){a=a|0;var b=0;b=i;if((a|0)!=0){Ze(a)}i=b;return}function Mc(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;b=i;if((a|0)==0){i=b;return}d=a+4|0;e=c[d>>2]|0;f=a+20|0;g=c[f>>2]|0;if((e|0)>0){h=e;e=g;j=0;while(1){k=c[e+(j<<2)>>2]|0;if((k|0)==0){l=h;m=e}else{Ze(k);l=c[d>>2]|0;m=c[f>>2]|0}k=j+1|0;if((k|0)<(l|0)){h=l;e=m;j=k}else{n=m;break}}}else{n=g}Ze(n);n=a+24|0;g=a+28|0;m=c[g>>2]|0;if((c[n>>2]|0)>0){j=m;e=0;while(1){Ze(c[j+(e<<2)>>2]|0);l=e+1|0;h=c[g>>2]|0;if((l|0)<(c[n>>2]|0)){e=l;j=h}else{o=h;break}}}else{o=m}Ze(o);Ze(a);i=b;return}function Nc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;d=i;Db(b,c[a>>2]|0,24);Db(b,c[a+4>>2]|0,24);Db(b,(c[a+8>>2]|0)+ -1|0,24);e=a+12|0;Db(b,(c[e>>2]|0)+ -1|0,6);Db(b,c[a+20>>2]|0,8);if((c[e>>2]|0)<=0){i=d;return}f=a+24|0;g=0;h=0;do{j=f+(h<<2)|0;k=c[j>>2]|0;do{if((k|0)==0){l=0;m=9}else{n=k;o=0;while(1){p=n>>>1;if((p|0)==0){break}else{o=o+1|0;n=p}}if((o|0)<=2){l=k;m=9;break}Db(b,k,3);Db(b,1,1);Db(b,c[j>>2]>>3,5)}}while(0);if((m|0)==9){m=0;Db(b,l,4)}k=c[j>>2]|0;if((k|0)==0){q=0}else{n=k;k=0;while(1){p=(n&1)+k|0;r=n>>>1;if((r|0)==0){q=p;break}else{k=p;n=r}}}g=q+g|0;h=h+1|0;}while((h|0)<(c[e>>2]|0));if((g|0)<=0){i=d;return}e=a+280|0;a=0;do{Db(b,c[e+(a<<2)>>2]|0,8);a=a+1|0;}while((a|0)<(g|0));i=d;return}function Oc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;e=_e(1,2840)|0;f=c[a+28>>2]|0;c[e>>2]=Hb(b,24)|0;c[e+4>>2]=Hb(b,24)|0;c[e+8>>2]=(Hb(b,24)|0)+1;a=Hb(b,6)|0;g=e+12|0;c[g>>2]=a+1;h=Hb(b,8)|0;j=e+20|0;c[j>>2]=h;a:do{if((h|0)<0){k=27}else{do{if((a|0)>-1){l=e+24|0;m=0;n=0;do{o=Hb(b,3)|0;p=Hb(b,1)|0;if((p|0)<0){k=27;break a}if((p|0)==0){q=o}else{p=Hb(b,5)|0;if((p|0)<0){k=27;break a}q=p<<3|o}c[l+(n<<2)>>2]=q;if((q|0)==0){r=0}else{o=q;p=0;while(1){s=(o&1)+p|0;t=o>>>1;if((t|0)==0){r=s;break}else{p=s;o=t}}}m=r+m|0;n=n+1|0;}while((n|0)<(c[g>>2]|0));n=(m|0)>0;if(!n){u=0;v=m;break}l=e+280|0;o=0;while(1){p=Hb(b,8)|0;if((p|0)<0){k=27;break a}c[l+(o<<2)>>2]=p;p=o+1|0;if((p|0)<(m|0)){o=p}else{u=n;v=m;break}}}else{u=0;v=0}}while(0);m=c[j>>2]|0;n=c[f+24>>2]|0;if((m|0)>=(n|0)){break}if(u){o=e+280|0;l=f+1824|0;p=0;while(1){t=c[o+(p<<2)>>2]|0;if((t|0)>=(n|0)){k=27;break a}s=p+1|0;if((c[(c[l+(t<<2)>>2]|0)+12>>2]|0)==0){k=27;break a}if((s|0)<(v|0)){p=s}else{w=l;break}}}else{w=f+1824|0}l=c[w+(m<<2)>>2]|0;p=c[l+4>>2]|0;n=c[l>>2]|0;if((n|0)<1){break}l=c[g>>2]|0;o=n;n=1;do{n=$(l,n)|0;o=o+ -1|0;if((n|0)>(p|0)){k=27;break a}}while((o|0)>0);c[e+16>>2]=n;x=e;i=d;return x|0}}while(0);do{if((k|0)==27){if((e|0)==0){x=0}else{break}i=d;return x|0}}while(0);Ze(e);x=0;i=d;return x|0}function Pc(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;d=i;e=_e(1,44)|0;f=c[(c[a+4>>2]|0)+28>>2]|0;c[e>>2]=b;a=c[b+12>>2]|0;c[e+4>>2]=a;g=f+2848|0;f=c[g>>2]|0;c[e+12>>2]=f;h=f+((c[b+20>>2]|0)*56|0)|0;c[e+16>>2]=h;f=c[h>>2]|0;h=_e(a,4)|0;c[e+20>>2]=h;if((a|0)>0){j=b+24|0;k=b+280|0;b=0;l=0;m=0;while(1){n=c[j+(l<<2)>>2]|0;do{if((n|0)==0){o=b;p=m}else{q=n;r=0;while(1){s=r+1|0;t=q>>>1;if((t|0)==0){break}else{r=s;q=t}}if((s|0)==0){o=b;p=m;break}q=(s|0)>(m|0)?s:m;t=h+(l<<2)|0;c[t>>2]=_e(s,4)|0;if((r|0)>-1){u=b;v=0}else{o=b;p=q;break}while(1){if((n&1<<v|0)==0){w=u}else{c[(c[t>>2]|0)+(v<<2)>>2]=(c[g>>2]|0)+((c[k+(u<<2)>>2]|0)*56|0);w=u+1|0}x=v+1|0;if((x|0)<(s|0)){u=w;v=x}else{o=w;p=q;break}}}}while(0);n=l+1|0;if((n|0)<(a|0)){b=o;l=n;m=p}else{y=p;break}}}else{y=0}p=e+24|0;c[p>>2]=1;m=(f|0)>0;if(m){l=1;o=0;do{l=$(l,a)|0;o=o+1|0;}while((o|0)<(f|0));c[p>>2]=l;z=l}else{z=1}c[e+8>>2]=y;y=Ye(z<<2)|0;c[e+28>>2]=y;if((z|0)<=0){i=d;return e|0}l=f<<2;if(m){A=0}else{m=0;do{c[y+(m<<2)>>2]=Ye(l)|0;m=m+1|0;}while((m|0)<(z|0));i=d;return e|0}do{m=Ye(l)|0;c[y+(A<<2)>>2]=m;p=z;o=0;b=A;do{p=(p|0)/(a|0)|0;w=(b|0)/(p|0)|0;b=b-($(w,p)|0)|0;c[m+(o<<2)>>2]=w;o=o+1|0;}while((o|0)<(f|0));A=A+1|0;}while((A|0)<(z|0));i=d;return e|0}function Qc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0;g=i;if((f|0)>0){h=0;j=0}else{i=g;return 0}while(1){if((c[e+(h<<2)>>2]|0)==0){k=j}else{c[d+(j<<2)>>2]=c[d+(h<<2)>>2];k=j+1|0}l=h+1|0;if((l|0)<(f|0)){h=l;j=k}else{break}}if((k|0)==0){i=g;return 0}Rc(a,b,d,k,3);i=g;return 0}function Rc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;g=i;h=c[b>>2]|0;j=c[h+8>>2]|0;k=b+16|0;l=c[c[k>>2]>>2]|0;m=c[a+36>>2]>>1;n=c[h+4>>2]|0;o=((n|0)<(m|0)?n:m)-(c[h>>2]|0)|0;if((o|0)<=0){i=g;return}m=(o|0)/(j|0)|0;o=i;i=i+((1*(e<<2)|0)+7&-8)|0;n=o;o=(e|0)>0;if(o){p=((l+ -1+m|0)/(l|0)|0)<<2;q=0;do{c[n+(q<<2)>>2]=ec(a,p)|0;q=q+1|0;}while((q|0)<(e|0))}q=b+8|0;p=c[q>>2]|0;if((p|0)<=0){i=g;return}r=(m|0)>0;s=a+4|0;a=h+16|0;t=b+28|0;u=(l|0)>0;v=b+20|0;b=p;p=0;a:while(1){if(r){w=1<<p;x=0;y=0;while(1){if(!((p|0)!=0|o^1)){z=0;do{A=td(c[k>>2]|0,s)|0;if((A|0)==-1){B=26;break a}if((A|0)>=(c[a>>2]|0)){B=26;break a}C=c[(c[t>>2]|0)+(A<<2)>>2]|0;c[(c[n+(z<<2)>>2]|0)+(y<<2)>>2]=C;z=z+1|0;if((C|0)==0){B=26;break a}}while((z|0)<(e|0))}b:do{if(u&(x|0)<(m|0)){if(o){D=x;E=0}else{z=x;C=0;while(1){A=C+1|0;F=z+1|0;if((A|0)<(l|0)&(F|0)<(m|0)){C=A;z=F}else{G=F;break b}}}while(1){z=$(D,j)|0;C=0;do{F=(c[h>>2]|0)+z|0;A=c[(c[(c[n+(C<<2)>>2]|0)+(y<<2)>>2]|0)+(E<<2)>>2]|0;do{if((c[h+24+(A<<2)>>2]&w|0)!=0){H=c[(c[(c[v>>2]|0)+(A<<2)>>2]|0)+(p<<2)>>2]|0;if((H|0)==0){break}if((db[f&7](H,(c[d+(C<<2)>>2]|0)+(F<<2)|0,s,j)|0)==-1){B=26;break a}}}while(0);C=C+1|0;}while((C|0)<(e|0));C=E+1|0;z=D+1|0;if((C|0)<(l|0)&(z|0)<(m|0)){D=z;E=C}else{G=z;break}}}else{G=x}}while(0);if((G|0)<(m|0)){x=G;y=y+1|0}else{break}}I=c[q>>2]|0}else{I=b}y=p+1|0;if((y|0)<(I|0)){b=I;p=y}else{B=26;break}}if((B|0)==26){i=g;return}}function Sc(a,b,d,e,f,g,h,j){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0;j=i;if((g|0)>0){k=0;l=0}else{i=j;return 0}while(1){if((c[f+(k<<2)>>2]|0)==0){m=l}else{c[e+(l<<2)>>2]=c[e+(k<<2)>>2];m=l+1|0}b=k+1|0;if((b|0)<(g|0)){k=b;l=m}else{break}}if((m|0)==0){i=j;return 0}Tc(a,d,e,m,h);i=j;return 0}function Tc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0;g=i;i=i+1088|0;h=g;j=h;k=g+32|0;l=k;m=g+64|0;n=m;o=g+576|0;p=o;q=c[b>>2]|0;r=c[q+8>>2]|0;s=c[q+12>>2]|0;t=b+16|0;u=c[c[t>>2]>>2]|0;v=((c[q+4>>2]|0)-(c[q>>2]|0)|0)/(r|0)|0;hf(m|0,0,512)|0;hf(o|0,0,512)|0;o=b+8|0;m=c[o>>2]|0;if((m|0)<=0){i=g;return}w=(v|0)>0;x=(e|0)>0;y=(u|0)>1;z=b+36|0;A=(u|0)>0;B=b+20|0;C=b+32|0;b=0-u|0;D=m;m=0;while(1){if(w){E=(m|0)==0;F=1<<m;G=0;while(1){a:do{if(E&x){if(y){H=0}else{I=0;while(1){J=c[(c[f+(I<<2)>>2]|0)+(G<<2)>>2]|0;K=c[t>>2]|0;if((J|0)<(c[K+4>>2]|0)){L=sd(K,J,a)|0;c[z>>2]=(c[z>>2]|0)+L}I=I+1|0;if((I|0)>=(e|0)){break a}}}do{I=c[f+(H<<2)>>2]|0;L=1;J=c[I+(G<<2)>>2]|0;while(1){K=$(J,s)|0;M=L+G|0;if((M|0)<(v|0)){N=(c[I+(M<<2)>>2]|0)+K|0}else{N=K}K=L+1|0;if((K|0)<(u|0)){L=K;J=N}else{break}}J=c[t>>2]|0;if((N|0)<(c[J+4>>2]|0)){L=sd(J,N,a)|0;c[z>>2]=(c[z>>2]|0)+L}H=H+1|0;}while((H|0)<(e|0))}}while(0);if(A&(G|0)<(v|0)){L=G-v|0;J=L>>>0<b>>>0?b:L;L=G;I=1;while(1){K=$(L,r)|0;M=(c[q>>2]|0)+K|0;if(x){K=0;do{O=c[f+(K<<2)>>2]|0;P=c[O+(L<<2)>>2]|0;if(E){Q=p+(P<<2)|0;c[Q>>2]=(c[Q>>2]|0)+r}Q=f+(K<<2)|0;do{if((c[q+24+(P<<2)>>2]&F|0)!=0){R=c[(c[(c[B>>2]|0)+(P<<2)>>2]|0)+(m<<2)>>2]|0;if((R|0)==0){break}S=c[d+(K<<2)>>2]|0;T=c[R>>2]|0;U=(r|0)/(T|0)|0;if((U|0)>0){V=R+48|0;W=R+52|0;X=R+44|0;Y=R+12|0;Z=R+4|0;_=T;aa=0;ba=0;while(1){ca=($(ba,T)|0)+M|0;da=S+(ca<<2)|0;ea=c[V>>2]|0;fa=c[W>>2]|0;ga=c[X>>2]|0;ha=ga>>1;c[h+0>>2]=0;c[h+4>>2]=0;c[h+8>>2]=0;c[h+12>>2]=0;c[h+16>>2]=0;c[h+20>>2]=0;c[h+24>>2]=0;c[h+28>>2]=0;ia=(_|0)>0;do{if((fa|0)==1){if(!ia){ja=0;break}ka=ga+ -1|0;la=0;ma=0;na=_;while(1){oa=na+ -1|0;pa=c[S+(ca+oa<<2)>>2]|0;qa=pa-ea|0;if((qa|0)<(ha|0)){ra=(ha-qa<<1)+ -1|0}else{ra=qa-ha<<1}qa=$(ma,ga)|0;if((ra|0)<0){sa=0}else{sa=(ra|0)<(ga|0)?ra:ka}ta=sa+qa|0;c[j+(oa<<2)>>2]=pa;pa=la+1|0;if((pa|0)<(_|0)){la=pa;ma=ta;na=oa}else{ja=ta;break}}}else{if(!ia){ja=0;break}na=(fa>>1)-ea|0;ma=ga+ -1|0;la=0;ka=0;ta=_;while(1){oa=ta+ -1|0;pa=(na+(c[S+(ca+oa<<2)>>2]|0)|0)/(fa|0)|0;if((pa|0)<(ha|0)){ua=(ha-pa<<1)+ -1|0}else{ua=pa-ha<<1}qa=$(ka,ga)|0;if((ua|0)<0){va=0}else{va=(ua|0)<(ga|0)?ua:ma}wa=va+qa|0;c[j+(oa<<2)>>2]=($(pa,fa)|0)+ea;pa=la+1|0;if((pa|0)<(_|0)){la=pa;ka=wa;ta=oa}else{ja=wa;break}}}}while(0);ha=c[(c[Y>>2]|0)+8>>2]|0;do{if((c[ha+(ja<<2)>>2]|0)<1){c[k+0>>2]=0;c[k+4>>2]=0;c[k+8>>2]=0;c[k+12>>2]=0;c[k+16>>2]=0;c[k+20>>2]=0;c[k+24>>2]=0;c[k+28>>2]=0;ta=($(ga+ -1|0,fa)|0)+ea|0;ka=c[Z>>2]|0;if((ka|0)>0){xa=-1;ya=0;za=ja}else{Aa=ja;break}while(1){do{if((c[ha+(ya<<2)>>2]|0)>0){if(ia){la=0;ma=0;while(1){na=(c[l+(la<<2)>>2]|0)-(c[S+(ca+la<<2)>>2]|0)|0;wa=($(na,na)|0)+ma|0;na=la+1|0;if((na|0)<(_|0)){ma=wa;la=na}else{Ba=wa;break}}}else{Ba=0}if(!((xa|0)==-1|(Ba|0)<(xa|0))){Ca=xa;Da=za;break}c[h+0>>2]=c[k+0>>2];c[h+4>>2]=c[k+4>>2];c[h+8>>2]=c[k+8>>2];c[h+12>>2]=c[k+12>>2];c[h+16>>2]=c[k+16>>2];c[h+20>>2]=c[k+20>>2];c[h+24>>2]=c[k+24>>2];c[h+28>>2]=c[k+28>>2];Ca=Ba;Da=ya}else{Ca=xa;Da=za}}while(0);la=c[k>>2]|0;if((la|0)<(ta|0)){Ea=la;Fa=l}else{la=l;ma=0;while(1){wa=ma+1|0;c[la>>2]=0;na=l+(wa<<2)|0;oa=c[na>>2]|0;if((oa|0)<(ta|0)){Ea=oa;Fa=na;break}else{ma=wa;la=na}}}if((Ea|0)>-1){la=(c[W>>2]|0)+Ea|0;c[Fa>>2]=la;Ga=la}else{Ga=Ea}c[Fa>>2]=0-Ga;la=ya+1|0;if((la|0)<(ka|0)){xa=Ca;ya=la;za=Da}else{Aa=Da;break}}}else{Aa=ja}}while(0);if((Aa|0)>-1&ia){ca=da;ha=0;while(1){c[ca>>2]=(c[ca>>2]|0)-(c[j+(ha<<2)>>2]|0);ea=ha+1|0;if((ea|0)<(_|0)){ha=ea;ca=ca+4|0}else{break}}}Ha=(sd(R,Aa,a)|0)+aa|0;ca=ba+1|0;if((ca|0)>=(U|0)){break}_=c[R>>2]|0;aa=Ha;ba=ca}Ia=c[Q>>2]|0;Ja=Ha}else{Ia=O;Ja=0}c[C>>2]=(c[C>>2]|0)+Ja;ba=n+(c[Ia+(L<<2)>>2]<<2)|0;c[ba>>2]=(c[ba>>2]|0)+Ja}}while(0);K=K+1|0;}while((K|0)<(e|0))}K=L+1|0;if(!((I|0)<(u|0)&(K|0)<(v|0))){break}L=K;I=I+1|0}Ka=G-J|0}else{Ka=G}if((Ka|0)<(v|0)){G=Ka}else{break}}La=c[o>>2]|0}else{La=D}G=m+1|0;if((G|0)<(La|0)){D=La;m=G}else{break}}i=g;return}function Uc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0.0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0.0,A=0,B=0;g=i;if((f|0)>0){h=0;j=0}else{k=0;i=g;return k|0}while(1){if((c[e+(h<<2)>>2]|0)==0){l=j}else{c[d+(j<<2)>>2]=c[d+(h<<2)>>2];l=j+1|0}m=h+1|0;if((m|0)<(f|0)){h=m;j=l}else{break}}if((l|0)==0){k=0;i=g;return k|0}j=c[b>>2]|0;h=c[j+8>>2]|0;f=c[j+12>>2]|0;e=((c[j+4>>2]|0)-(c[j>>2]|0)|0)/(h|0)|0;m=ec(a,l<<2)|0;n=100.0/+(h|0);o=(l|0)>0;if(o){p=e<<2;q=0;do{r=ec(a,p)|0;c[m+(q<<2)>>2]=r;hf(r|0,0,p|0)|0;q=q+1|0;}while((q|0)<(l|0))}if((e|0)>0){q=(h|0)>0;p=f+ -1|0;f=(p|0)>0;a=0;do{r=$(a,h)|0;s=(c[j>>2]|0)+r|0;if(o){r=0;do{if(q){t=c[d+(r<<2)>>2]|0;u=0;v=0;w=0;do{x=c[t+(s+v<<2)>>2]|0;y=(x|0)>-1?x:0-x|0;w=(y|0)>(w|0)?y:w;u=y+u|0;v=v+1|0;}while((v|0)<(h|0));z=+(u|0);A=w}else{z=0.0;A=0}v=~~(n*z);a:do{if(f){t=0;while(1){if((A|0)<=(c[j+2328+(t<<2)>>2]|0)){y=c[j+2584+(t<<2)>>2]|0;if((y|0)<0|(v|0)<(y|0)){B=t;break a}}y=t+1|0;if((y|0)<(p|0)){t=y}else{B=y;break}}}else{B=0}}while(0);c[(c[m+(r<<2)>>2]|0)+(a<<2)>>2]=B;r=r+1|0;}while((r|0)<(l|0))}a=a+1|0;}while((a|0)<(e|0))}e=b+40|0;c[e>>2]=(c[e>>2]|0)+1;k=m;i=g;return k|0}function Vc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0;g=i;if((f|0)>0){h=0;j=0}else{i=g;return 0}while(1){if((c[e+(h<<2)>>2]|0)==0){k=j}else{c[d+(j<<2)>>2]=c[d+(h<<2)>>2];k=j+1|0}l=h+1|0;if((l|0)<(f|0)){h=l;j=k}else{break}}if((k|0)==0){i=g;return 0}Rc(a,b,d,k,4);i=g;return 0}function Wc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;g=i;if((f|0)>0){h=0;j=0}else{k=0;i=g;return k|0}do{j=((c[e+(h<<2)>>2]|0)!=0)+j|0;h=h+1|0;}while((h|0)<(f|0));if((j|0)==0){k=0;i=g;return k|0}j=c[b>>2]|0;h=c[j+8>>2]|0;e=c[j+12>>2]|0;l=((c[j+4>>2]|0)-(c[j>>2]|0)|0)/(h|0)|0;m=ec(a,4)|0;n=l<<2;o=ec(a,n)|0;c[m>>2]=o;hf(o|0,0,n|0)|0;if((l|0)>0){n=(h|0)>0;o=e+ -1|0;e=(o|0)>0;a=c[m>>2]|0;p=(f|0)>1;q=0;r=(c[j>>2]|0)/(f|0)|0;while(1){if(n){s=c[d>>2]|0;t=0;u=0;v=r;w=0;while(1){x=c[s+(v<<2)>>2]|0;y=(x|0)>-1?x:0-x|0;x=(y|0)>(w|0)?y:w;if(p){y=t;z=1;while(1){A=c[(c[d+(z<<2)>>2]|0)+(v<<2)>>2]|0;B=(A|0)>-1?A:0-A|0;A=(B|0)>(y|0)?B:y;B=z+1|0;if((B|0)<(f|0)){z=B;y=A}else{C=A;break}}}else{C=t}y=v+1|0;z=u+f|0;if((z|0)<(h|0)){t=C;u=z;v=y;w=x}else{D=C;E=y;F=x;break}}}else{D=0;E=r;F=0}a:do{if(e){w=0;while(1){if((F|0)<=(c[j+2328+(w<<2)>>2]|0)){if((D|0)<=(c[j+2584+(w<<2)>>2]|0)){G=w;break a}}v=w+1|0;if((v|0)<(o|0)){w=v}else{G=v;break}}}else{G=0}}while(0);c[a+(q<<2)>>2]=G;w=q+1|0;if((w|0)<(l|0)){q=w;r=E}else{break}}}E=b+40|0;c[E>>2]=(c[E>>2]|0)+1;k=m;i=g;return k|0}function Xc(a,b,d,e,f,g,h,j){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;j=i;i=i+8|0;k=j;l=k;m=c[b+36>>2]|0;n=(m|0)/2|0;o=ec(b,$(g<<2,n)|0)|0;c[k>>2]=o;if((g|0)<=0){i=j;return 0}k=(m|0)>1;m=0;b=0;do{p=c[e+(m<<2)>>2]|0;b=((c[f+(m<<2)>>2]|0)!=0)+b|0;if(k){q=0;r=m;while(1){c[o+(r<<2)>>2]=c[p+(q<<2)>>2];s=q+1|0;if((s|0)<(n|0)){r=r+g|0;q=s}else{break}}}m=m+1|0;}while((m|0)<(g|0));if((b|0)==0){i=j;return 0}Tc(a,d,l,1,h);i=j;return 0}function Yc(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;g=i;h=c[b>>2]|0;j=c[h+8>>2]|0;k=b+16|0;l=c[c[k>>2]>>2]|0;m=($(c[a+36>>2]|0,f)|0)>>1;n=c[h+4>>2]|0;o=((n|0)<(m|0)?n:m)-(c[h>>2]|0)|0;if((o|0)<=0){i=g;return 0}m=(o|0)/(j|0)|0;o=ec(a,((l+ -1+m|0)/(l|0)|0)<<2)|0;a:do{if((f|0)>0){n=0;while(1){p=n+1|0;if((c[e+(n<<2)>>2]|0)!=0){q=n;break a}if((p|0)<(f|0)){n=p}else{q=p;break}}}else{q=0}}while(0);if((q|0)==(f|0)){i=g;return 0}q=b+8|0;e=c[q>>2]|0;if((e|0)<=0){i=g;return 0}n=(m|0)>0;p=a+4|0;a=h+16|0;r=b+28|0;s=(l|0)>0;t=b+20|0;b=e;e=0;b:while(1){if(n){u=(e|0)==0;v=1<<e;w=0;x=0;while(1){if(u){y=td(c[k>>2]|0,p)|0;if((y|0)==-1){z=23;break b}if((y|0)>=(c[a>>2]|0)){z=23;break b}A=c[(c[r>>2]|0)+(y<<2)>>2]|0;c[o+(x<<2)>>2]=A;if((A|0)==0){z=23;break b}}if(s&(w|0)<(m|0)){A=o+(x<<2)|0;y=w;B=0;while(1){C=c[(c[A>>2]|0)+(B<<2)>>2]|0;do{if((c[h+24+(C<<2)>>2]&v|0)!=0){D=c[(c[(c[t>>2]|0)+(C<<2)>>2]|0)+(e<<2)>>2]|0;if((D|0)==0){break}E=$(y,j)|0;if((yd(D,d,(c[h>>2]|0)+E|0,f,p,j)|0)==-1){z=23;break b}}}while(0);C=B+1|0;E=y+1|0;if((C|0)<(l|0)&(E|0)<(m|0)){y=E;B=C}else{F=E;break}}}else{F=w}if((F|0)<(m|0)){w=F;x=x+1|0}else{break}}G=c[q>>2]|0}else{G=b}x=e+1|0;if((x|0)<(G|0)){b=G;e=x}else{z=23;break}}if((z|0)==23){i=g;return 0}return 0}function Zc(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;b=i;if((a|0)==0){c=0}else{d=a;a=0;while(1){e=a+1|0;f=d>>>1;if((f|0)==0){c=e;break}else{a=e;d=f}}}i=b;return c|0}
function _c(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0;e=i;i=i+136|0;f=e;g=f;h=(d|0)!=0;j=Ye((h?d:b)<<2)|0;hf(f|0,0,132)|0;f=(b|0)>0;a:do{if(f){k=g+4|0;l=(d|0)==0|0;m=0;n=0;b:while(1){o=c[a+(n<<2)>>2]|0;c:do{if((o|0)>0){p=c[g+(o<<2)>>2]|0;if((o|0)<32){if((p>>>o|0)!=0){break b}}c[j+(m<<2)>>2]=p;q=p;r=o;while(1){s=g+(r<<2)|0;if((q&1|0)!=0){t=9;break}c[s>>2]=q+1;u=r+ -1|0;if((u|0)<=0){break}q=c[g+(u<<2)>>2]|0;r=u}do{if((t|0)==9){t=0;if((r|0)==1){c[k>>2]=(c[k>>2]|0)+1;break}else{c[s>>2]=c[g+(r+ -1<<2)>>2]<<1;break}}}while(0);r=o+1|0;if((r|0)<33){v=p;w=r;x=o}else{y=1;break}while(1){r=g+(w<<2)|0;q=c[r>>2]|0;if((q>>>1|0)!=(v|0)){y=1;break c}c[r>>2]=c[g+(x<<2)>>2]<<1;r=w+1|0;if((r|0)<33){u=w;w=r;x=u;v=q}else{y=1;break}}}else{y=l}}while(0);o=n+1|0;if((o|0)<(b|0)){m=m+y|0;n=o}else{break a}}Ze(j);z=0;i=e;return z|0}}while(0);d:do{if((d|0)!=1){y=1;while(1){v=y+1|0;if((c[g+(y<<2)>>2]&-1>>>(32-y|0)|0)!=0){break}if((v|0)<33){y=v}else{break d}}Ze(j);z=0;i=e;return z|0}}while(0);if(!f){z=j;i=e;return z|0}if(h){A=0;B=0}else{h=0;f=0;while(1){g=c[a+(f<<2)>>2]|0;if((g|0)>0){d=c[j+(h<<2)>>2]|0;y=0;v=0;while(1){x=d>>>y&1|v<<1;w=y+1|0;if((w|0)<(g|0)){v=x;y=w}else{C=x;break}}}else{C=0}c[j+(h<<2)>>2]=C;y=f+1|0;if((y|0)<(b|0)){h=h+1|0;f=y}else{z=j;break}}i=e;return z|0}while(1){f=c[a+(B<<2)>>2]|0;if((f|0)>0){h=c[j+(A<<2)>>2]|0;C=0;y=0;while(1){v=h>>>C&1|y<<1;g=C+1|0;if((g|0)<(f|0)){y=v;C=g}else{D=v;break}}}else{D=0}if((f|0)==0){E=A}else{c[j+(A<<2)>>2]=D;E=A+1|0}C=B+1|0;if((C|0)<(b|0)){A=E;B=C}else{z=j;break}}i=e;return z|0}function $c(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0;b=i;d=c[a+4>>2]|0;e=c[a>>2]|0;a=~~+N(+(+Q(+(+(d|0)),+(1.0/+(e|0)))));if((e|0)>0){f=a}else{while(1){}}while(1){a=f+1|0;g=1;h=1;j=0;do{h=$(h,f)|0;g=$(g,a)|0;j=j+1|0;}while((j|0)<(e|0));if((h|0)<=(d|0)&(g|0)>(d|0)){break}if((h|0)>(d|0)){f=f+ -1|0;continue}else{f=f+1|0;continue}}i=b;return f|0}function ad(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,h=0,j=0,k=0.0,l=0.0,m=0.0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0.0,H=0.0,I=0,J=0,K=0,L=0;e=i;f=a+12|0;if(!(((c[f>>2]|0)+ -1|0)>>>0<2)){h=0;i=e;return h|0}j=c[a+16>>2]|0;k=+(j&2097151|0);if((j|0)<0){l=-k}else{l=k}k=+Xe(l,(j>>>21&1023)+ -788|0);j=c[a+20>>2]|0;l=+(j&2097151|0);if((j|0)<0){m=-l}else{m=l}l=+Xe(m,(j>>>21&1023)+ -788|0);j=c[a>>2]|0;n=_e($(j,b)|0,4)|0;b=c[f>>2]|0;if((b|0)==1){f=c[a+4>>2]|0;if((j|0)<=0){while(1){}}o=~~+N(+(+Q(+(+(f|0)),+(1.0/+(j|0)))));while(1){p=o+1|0;q=1;r=1;s=0;do{r=$(r,o)|0;q=$(q,p)|0;s=s+1|0;}while((s|0)<(j|0));if((r|0)<=(f|0)&(q|0)>(f|0)){break}o=(r|0)>(f|0)?o+ -1|0:p}if((f|0)<=0){h=n;i=e;return h|0}s=(d|0)!=0;t=a+8|0;u=s^1;v=a+32|0;m=l;w=k;x=a+28|0;y=0;z=0;while(1){do{if(s){if(!((c[(c[t>>2]|0)+(z<<2)>>2]|0)!=0|u)){A=y;break}B=c[v>>2]|0;C=(c[x>>2]|0)==0;D=d+(y<<2)|0;E=1;F=0;G=0.0;while(1){H=G+(w+m*+O(+(+(c[B+((((z|0)/(E|0)|0|0)%(o|0)|0)<<2)>>2]|0))));g[n+(($(c[D>>2]|0,j)|0)+F<<2)>>2]=H;I=$(E,o)|0;J=F+1|0;if((J|0)<(j|0)){G=C?G:H;F=J;E=I}else{K=25;break}}}else{E=c[v>>2]|0;if((c[x>>2]|0)==0){F=1;C=0;while(1){g[n+(($(j,y)|0)+C<<2)>>2]=w+m*+O(+(+(c[E+((((z|0)/(F|0)|0|0)%(o|0)|0)<<2)>>2]|0)));D=$(F,o)|0;B=C+1|0;if((B|0)<(j|0)){C=B;F=D}else{K=25;break}}}else{F=1;C=0;G=0.0;while(1){H=G+(w+m*+O(+(+(c[E+((((z|0)/(F|0)|0|0)%(o|0)|0)<<2)>>2]|0))));g[n+(($(j,y)|0)+C<<2)>>2]=H;D=$(F,o)|0;B=C+1|0;if((B|0)<(j|0)){G=H;C=B;F=D}else{K=25;break}}}}}while(0);if((K|0)==25){K=0;A=y+1|0}p=z+1|0;if((p|0)<(f|0)){y=A;z=p}else{h=n;break}}i=e;return h|0}else if((b|0)==2){b=c[a+4>>2]|0;if((b|0)<=0){h=n;i=e;return h|0}z=(d|0)!=0;A=a+8|0;y=z^1;f=a+32|0;m=l;l=k;o=a+28|0;a=0;x=0;while(1){if(z){if((c[(c[A>>2]|0)+(x<<2)>>2]|0)!=0|y){K=29}else{L=a}}else{K=29}if((K|0)==29){K=0;if((j|0)>0){v=c[f>>2]|0;u=(c[o>>2]|0)==0;t=d+(a<<2)|0;s=0;k=0.0;while(1){w=k+(l+m*+O(+(+(c[v+(($(j,x)|0)+s<<2)>>2]|0))));if(z){g[n+(($(c[t>>2]|0,j)|0)+s<<2)>>2]=w}else{g[n+(($(j,a)|0)+s<<2)>>2]=w}p=s+1|0;if((p|0)<(j|0)){s=p;k=u?k:w}else{break}}}L=a+1|0}u=x+1|0;if((u|0)<(b|0)){a=L;x=u}else{h=n;break}}i=e;return h|0}else{h=n;i=e;return h|0}return 0}function bd(a){a=a|0;var b=0,d=0;b=i;if((c[a+36>>2]|0)==0){i=b;return}d=c[a+32>>2]|0;if((d|0)!=0){Ze(d)}d=c[a+8>>2]|0;if((d|0)!=0){Ze(d)}Ze(a);i=b;return}function cd(a){a=a|0;var b=0,d=0;b=i;d=c[a+16>>2]|0;if((d|0)!=0){Ze(d)}d=c[a+20>>2]|0;if((d|0)!=0){Ze(d)}d=c[a+24>>2]|0;if((d|0)!=0){Ze(d)}d=c[a+28>>2]|0;if((d|0)!=0){Ze(d)}d=c[a+32>>2]|0;if((d|0)!=0){Ze(d)}d=a+0|0;a=d+56|0;do{c[d>>2]=0;d=d+4|0}while((d|0)<(a|0));i=b;return}function dd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0.0,n=0.0,o=0.0,p=0,q=0.0,r=0.0,s=0.0,t=0,u=0,v=0;d=i;e=a+0|0;f=e+56|0;do{c[e>>2]=0;e=e+4|0}while((e|0)<(f|0));c[a+12>>2]=b;e=b+4|0;c[a+4>>2]=c[e>>2];c[a+8>>2]=c[e>>2];c[a>>2]=c[b>>2];c[a+20>>2]=_c(c[b+8>>2]|0,c[e>>2]|0,0)|0;f=c[e>>2]|0;e=c[b>>2]|0;if((e|0)<=0){while(1){}}g=~~+N(+(+Q(+(+(f|0)),+(1.0/+(e|0)))));while(1){h=g+1|0;j=1;k=1;l=0;do{k=$(k,g)|0;j=$(j,h)|0;l=l+1|0;}while((l|0)<(e|0));if((k|0)<=(f|0)&(j|0)>(f|0)){break}g=(k|0)>(f|0)?g+ -1|0:h}c[a+44>>2]=g;g=c[b+16>>2]|0;m=+(g&2097151|0);if((g|0)<0){n=-m}else{n=m}c[a+48>>2]=~~+Ja(+(+Xe(n,(g>>>21&1023)+ -788|0)));g=c[b+20>>2]|0;n=+(g&2097151|0);b=g>>>21&1023;if((g|0)>=0){o=n;p=b+ -788|0;q=+Xe(o,p);r=q;s=+Ja(+r);t=~~s;u=a+52|0;v=u;c[v>>2]=t;i=d;return 0}o=-n;p=b+ -788|0;q=+Xe(o,p);r=q;s=+Ja(+r);t=~~s;u=a+52|0;v=u;c[v>>2]=t;i=d;return 0}function ed(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;e=i;f=b+0|0;g=f+56|0;do{c[f>>2]=0;f=f+4|0}while((f|0)<(g|0));f=d+4|0;g=c[f>>2]|0;if((g|0)>0){h=c[d+8>>2]|0;j=0;k=0;while(1){l=((c[h+(j<<2)>>2]|0)>0)+k|0;m=j+1|0;if((m|0)<(g|0)){k=l;j=m}else{n=l;break}}}else{n=0}c[b+4>>2]=g;g=b+8|0;c[g>>2]=n;c[b>>2]=c[d>>2];if((n|0)<=0){o=0;i=e;return o|0}j=d+8|0;k=_c(c[j>>2]|0,c[f>>2]|0,n)|0;h=n<<2;l=i;i=i+((1*h|0)+7&-8)|0;m=l;if((k|0)==0){cd(b);o=-1;i=e;return o|0}else{p=0}do{l=k+(p<<2)|0;q=c[l>>2]|0;r=q>>>16|q<<16;q=r>>>8&16711935|r<<8&-16711936;r=q>>>4&252645135|q<<4&-252645136;q=r>>>2&858993459|r<<2&-858993460;c[l>>2]=q>>>1&1431655765|q<<1&-1431655766;c[m+(p<<2)>>2]=l;p=p+1|0;}while((p|0)<(n|0));Ya(m|0,n|0,4,12);p=i;i=i+((1*h|0)+7&-8)|0;l=p;p=Ye(h)|0;q=b+20|0;c[q>>2]=p;r=0;while(1){c[l+((c[m+(r<<2)>>2]|0)-k>>2<<2)>>2]=r;s=r+1|0;if((s|0)<(n|0)){r=s}else{t=0;break}}do{c[p+(c[l+(t<<2)>>2]<<2)>>2]=c[k+(t<<2)>>2];t=t+1|0;}while((t|0)<(n|0));Ze(k);c[b+16>>2]=ad(d,n,l)|0;n=Ye(h)|0;c[b+24>>2]=n;h=c[f>>2]|0;d=(h|0)>0;do{if(d){k=c[j>>2]|0;t=0;p=0;while(1){if((c[k+(t<<2)>>2]|0)>0){c[n+(c[l+(p<<2)>>2]<<2)>>2]=t;u=p+1|0}else{u=p}r=t+1|0;if((r|0)<(h|0)){t=r;p=u}else{break}}p=b+28|0;c[p>>2]=Ye(u)|0;if(d){v=h;w=0;x=0}else{y=p;z=0;break}while(1){t=c[(c[j>>2]|0)+(w<<2)>>2]|0;if((t|0)>0){a[(c[p>>2]|0)+(c[l+(x<<2)>>2]|0)|0]=t;A=c[f>>2]|0;B=x+1|0}else{A=v;B=x}t=w+1|0;if((t|0)<(A|0)){v=A;w=t;x=B}else{y=p;z=B;break}}}else{p=b+28|0;c[p>>2]=Ye(0)|0;y=p;z=0}}while(0);B=c[g>>2]|0;if((B|0)==0){C=-4}else{g=B;B=0;while(1){x=g>>>1;if((x|0)==0){break}else{B=B+1|0;g=x}}C=B+ -3|0}B=b+36|0;g=(C|0)<5?5:C;C=(g|0)>8?8:g;c[B>>2]=C;g=1<<C;x=_e(g,4)|0;c[b+32>>2]=x;w=b+40|0;c[w>>2]=0;a:do{if((z|0)>0){b=c[y>>2]|0;A=0;v=C;f=0;while(1){l=b+f|0;j=a[l]|0;h=j<<24>>24;if((A|0)<(h|0)){c[w>>2]=h;D=a[l]|0}else{D=j}j=D<<24>>24;do{if((j|0)>(v|0)){E=v}else{h=c[(c[q>>2]|0)+(f<<2)>>2]|0;d=h>>>16|h<<16;h=d>>>8&16711935|d<<8&-16711936;d=h>>>4&252645135|h<<4&-252645136;h=d>>>2&858993459|d<<2&-858993460;d=h>>>1&1431655765|h<<1&-1431655766;if((1<<v-j|0)<=0){E=v;break}h=f+1|0;u=j;n=0;while(1){c[x+((d|n<<u)<<2)>>2]=h;p=n+1|0;t=c[B>>2]|0;k=a[l]|0;if((p|0)<(1<<t-k|0)){n=p;u=k}else{E=t;break}}}}while(0);l=f+1|0;if((l|0)>=(z|0)){F=E;break a}A=c[w>>2]|0;v=E;f=l}}else{F=C}}while(0);C=-2<<31-F;if((g|0)>0){G=F;H=0;I=0;J=0}else{o=0;i=e;return o|0}while(1){F=I<<32-G;E=F>>>16|F<<16;w=E>>>8&16711935|E<<8&-16711936;E=w>>>4&252645135|w<<4&-252645136;w=E>>>2&858993459|E<<2&-858993460;E=x+((w>>>1&1431655765|w<<1&-1431655766)<<2)|0;if((c[E>>2]|0)==0){w=J;while(1){D=w+1|0;if((D|0)>=(z|0)){break}if((c[(c[q>>2]|0)+(D<<2)>>2]|0)>>>0>F>>>0){break}else{w=D}}b:do{if((H|0)<(z|0)){D=c[q>>2]|0;y=H;while(1){f=y+1|0;if(F>>>0<(c[D+(y<<2)>>2]&C)>>>0){K=y;break b}if((f|0)<(z|0)){y=f}else{K=f;break}}}else{K=H}}while(0);F=z-K|0;c[E>>2]=(w>>>0>32767?-1073774592:w<<15|-2147483648)|(F>>>0>32767?32767:F);L=K;M=w}else{L=H;M=J}F=I+1|0;if((F|0)>=(g|0)){o=0;break}G=c[B>>2]|0;H=L;I=F;J=M}i=e;return o|0}function fd(a,b){a=a|0;b=b|0;var d=0;d=c[c[a>>2]>>2]|0;a=c[c[b>>2]>>2]|0;i=i;return(d>>>0>a>>>0)-(d>>>0<a>>>0)|0}function gd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;d=i;e=c[a>>2]|0;if((e|0)==1){i=d;return}f=c[a+4>>2]|0;h=c[a+8>>2]|0;a=c[h+4>>2]|0;if((a|0)<=0){i=d;return}j=a+1|0;k=e+ -1|0;l=e;m=0;n=e;o=1;while(1){p=c[h+(j-m<<2)>>2]|0;q=(n|0)/(p|0)|0;r=(e|0)/(n|0)|0;s=$(r,q)|0;t=l-($(r,p+ -1|0)|0)|0;u=1-o|0;do{if((p|0)==2){v=f+(k+t<<2)|0;if((o|0)==1){kd(r,q,b,f,v);w=u;break}else{kd(r,q,f,b,v);w=u;break}}else if((p|0)==4){v=t+r|0;x=f+(k+t<<2)|0;y=f+(k+v<<2)|0;z=f+(k+r+v<<2)|0;if((o|0)==1){jd(r,q,b,f,x,y,z);w=u;break}else{jd(r,q,f,b,x,y,z);w=u;break}}else{z=f+(k+t<<2)|0;if((((r|0)==1?o:u)|0)==0){ld(r,p,q,s,b,b,b,f,f,z);w=1;break}else{ld(r,p,q,s,f,f,f,b,b,z);w=0;break}}}while(0);s=m+1|0;if((s|0)<(a|0)){m=s;o=w;n=q;l=t}else{break}}if((w|0)!=1&(e|0)>0){A=0}else{i=d;return}do{g[b+(A<<2)>>2]=+g[f+(A<<2)>>2];A=A+1|0;}while((A|0)<(e|0));i=d;return}function hd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0.0,w=0,x=0.0,y=0.0,z=0,A=0,B=0.0,C=0.0,D=0,E=0;d=i;c[a>>2]=b;e=_e(b*3|0,4)|0;c[a+4>>2]=e;f=_e(32,4)|0;c[a+8>>2]=f;if((b|0)==1){i=d;return}a=f+8|0;h=0;j=0;k=b;l=0;a:while(1){if((h|0)<4){m=c[28176+(h<<2)>>2]|0}else{m=l+2|0}n=(m|0)!=2;o=j;p=k;while(1){q=(p|0)/(m|0)|0;if((p|0)!=($(q,m)|0)){break}r=o+1|0;c[f+(o+2<<2)>>2]=m;s=(o|0)==0;if(!(n|s)){if((o|0)>0){t=1;do{u=r-t|0;c[f+(u+2<<2)>>2]=c[f+(u+1<<2)>>2];t=t+1|0;}while((t|0)<(r|0))}c[a>>2]=2}if((q|0)==1){break a}else{o=r;p=q}}h=h+1|0;j=o;k=p;l=m}c[f>>2]=b;c[f+4>>2]=r;v=6.2831854820251465/+(b|0);if(!((o|0)>0&(s^1))){i=d;return}s=b+1|0;r=0;m=0;l=1;while(1){k=c[f+(m+2<<2)>>2]|0;j=$(k,l)|0;h=(b|0)/(j|0)|0;a=k+ -1|0;if((a|0)>0){k=(h|0)>2;n=r;t=0;u=0;while(1){w=u+l|0;x=v*+(w|0);if(k){y=0.0;z=n;A=2;while(1){B=y+1.0;C=x*B;g[e+(z+b<<2)>>2]=+R(+C);g[e+(s+z<<2)>>2]=+S(+C);D=A+2|0;if((D|0)<(h|0)){A=D;z=z+2|0;y=B}else{break}}}z=t+1|0;if((z|0)<(a|0)){n=n+h|0;t=z;u=w}else{break}}E=($(h,a)|0)+r|0}else{E=r}u=m+1|0;if((u|0)<(o|0)){r=E;m=u;l=j}else{break}}i=d;return}function id(a){a=a|0;var b=0,d=0;b=i;if((a|0)==0){i=b;return}d=c[a+4>>2]|0;if((d|0)!=0){Ze(d)}d=c[a+8>>2]|0;if((d|0)!=0){Ze(d)}d=a;c[d+0>>2]=0;c[d+4>>2]=0;c[d+8>>2]=0;i=b;return}function jd(a,b,c,d,e,f,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0.0,x=0,y=0,z=0.0,A=0,B=0,C=0,D=0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0;j=i;k=$(b,a)|0;l=k<<1;m=(b|0)>0;if(m){n=(a<<2)+ -1|0;o=a<<1;p=0;q=k;r=l+k|0;s=0;t=l;while(1){u=c+(q<<2)|0;v=c+(r<<2)|0;w=+g[u>>2]+ +g[v>>2];x=c+(s<<2)|0;y=c+(t<<2)|0;z=+g[x>>2]+ +g[y>>2];A=s<<2;g[d+(A<<2)>>2]=w+z;g[d+(n+A<<2)>>2]=z-w;B=A+o|0;g[d+(B+ -1<<2)>>2]=+g[x>>2]- +g[y>>2];g[d+(B<<2)>>2]=+g[v>>2]- +g[u>>2];u=p+1|0;if((u|0)<(b|0)){t=t+a|0;s=s+a|0;r=r+a|0;q=q+a|0;p=u}else{break}}}if((a|0)<2){i=j;return}do{if((a|0)!=2){do{if(m){p=a<<1;if((a|0)>2){C=0;D=0}else{break}while(1){q=D<<2;r=2;s=D;t=q;o=q+p|0;while(1){q=s+2|0;n=t+2|0;u=o+ -2|0;v=q+k|0;B=r+ -2|0;w=+g[e+(B<<2)>>2];z=+g[c+(v+ -1<<2)>>2];y=r+ -1|0;E=+g[e+(y<<2)>>2];F=+g[c+(v<<2)>>2];G=w*z+E*F;H=w*F-z*E;x=v+k|0;E=+g[f+(B<<2)>>2];z=+g[c+(x+ -1<<2)>>2];F=+g[f+(y<<2)>>2];w=+g[c+(x<<2)>>2];I=E*z+F*w;J=E*w-z*F;v=x+k|0;F=+g[h+(B<<2)>>2];z=+g[c+(v+ -1<<2)>>2];w=+g[h+(y<<2)>>2];E=+g[c+(v<<2)>>2];K=F*z+w*E;L=F*E-z*w;w=G+K;z=K-G;G=H+L;K=H-L;L=+g[c+(q<<2)>>2];H=J+L;E=L-J;J=+g[c+(s+1<<2)>>2];L=I+J;F=J-I;g[d+((t|1)<<2)>>2]=w+L;g[d+(n<<2)>>2]=H+G;g[d+(o+ -3<<2)>>2]=F-K;g[d+(u<<2)>>2]=z-E;v=n+p|0;g[d+(v+ -1<<2)>>2]=K+F;g[d+(v<<2)>>2]=E+z;v=u+p|0;g[d+(v+ -1<<2)>>2]=L-w;g[d+(v<<2)>>2]=G-H;v=r+2|0;if((v|0)<(a|0)){o=u;t=n;s=q;r=v}else{break}}r=C+1|0;if((r|0)<(b|0)){C=r;D=D+a|0}else{break}}}}while(0);if((a&1|0)==0){break}i=j;return}}while(0);D=a+ -1+k|0;C=a<<2;h=a<<1;if(!m){i=j;return}m=0;f=D;e=D+l|0;l=a;D=a;while(1){H=+g[c+(f<<2)>>2];G=+g[c+(e<<2)>>2];w=(H+G)*-.7071067690849304;L=(H-G)*.7071067690849304;p=c+(D+ -1<<2)|0;g[d+(l+ -1<<2)>>2]=+g[p>>2]+L;r=l+h|0;g[d+(r+ -1<<2)>>2]=+g[p>>2]-L;p=c+(f+k<<2)|0;g[d+(l<<2)>>2]=w- +g[p>>2];g[d+(r<<2)>>2]=w+ +g[p>>2];p=m+1|0;if((p|0)<(b|0)){D=D+a|0;l=l+C|0;e=e+a|0;f=f+a|0;m=p}else{break}}i=j;return}function kd(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0;f=i;h=$(b,a)|0;j=a<<1;k=(b|0)>0;if(k){l=j+ -1|0;m=0;n=0;o=h;while(1){p=c+(n<<2)|0;q=c+(o<<2)|0;r=n<<1;g[d+(r<<2)>>2]=+g[p>>2]+ +g[q>>2];g[d+(l+r<<2)>>2]=+g[p>>2]- +g[q>>2];q=m+1|0;if((q|0)<(b|0)){o=o+a|0;n=n+a|0;m=q}else{break}}}if((a|0)<2){i=f;return}do{if((a|0)!=2){if(k&(a|0)>2){m=0;n=0;o=h;while(1){l=n<<1;q=2;p=o;r=l+j|0;s=n;t=l;while(1){l=p+2|0;u=r+ -2|0;v=s+2|0;w=t+2|0;x=+g[e+(q+ -2<<2)>>2];y=+g[c+(p+1<<2)>>2];z=+g[e+(q+ -1<<2)>>2];A=+g[c+(l<<2)>>2];B=x*y+z*A;C=x*A-y*z;D=c+(v<<2)|0;g[d+(w<<2)>>2]=+g[D>>2]+C;g[d+(u<<2)>>2]=C- +g[D>>2];D=c+(s+1<<2)|0;g[d+((t|1)<<2)>>2]=B+ +g[D>>2];g[d+(r+ -3<<2)>>2]=+g[D>>2]-B;D=q+2|0;if((D|0)<(a|0)){t=w;s=v;r=u;p=l;q=D}else{break}}q=m+1|0;if((q|0)<(b|0)){m=q;n=n+a|0;o=o+a|0}else{break}}}if(((a|0)%2|0|0)!=1){break}i=f;return}}while(0);e=a+ -1|0;if(!k){i=f;return}k=0;o=a;n=h+e|0;h=e;while(1){g[d+(o<<2)>>2]=-+g[c+(n<<2)>>2];g[d+(o+ -1<<2)>>2]=+g[c+(h<<2)>>2];e=k+1|0;if((e|0)<(b|0)){h=h+a|0;n=n+a|0;o=o+j|0;k=e}else{break}}i=f;return}function ld(a,b,c,d,e,f,h,j,k,l){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0.0,o=0.0,p=0.0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,T=0.0,U=0.0,V=0.0,W=0.0,X=0.0,Y=0.0,Z=0.0,_=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0;m=i;n=6.2831854820251465/+(b|0);o=+R(+n);p=+S(+n);q=b+1>>1;r=a+ -1>>1;s=$(c,a)|0;t=$(b,a)|0;u=(a|0)==1;a:do{if(!u){if((d|0)>0){v=0;do{g[k+(v<<2)>>2]=+g[h+(v<<2)>>2];v=v+1|0;}while((v|0)<(d|0))}v=(b|0)>1;if(v){w=(c|0)>0;x=1;y=0;do{y=y+s|0;if(w){z=0;A=y;while(1){g[j+(A<<2)>>2]=+g[f+(A<<2)>>2];B=z+1|0;if((B|0)<(c|0)){A=A+a|0;z=B}else{break}}}x=x+1|0;}while((x|0)<(b|0))}x=0-a|0;do{if((r|0)>(c|0)){if(!v){break}y=(c|0)>0;w=(a|0)>2;z=x;A=1;B=0;do{B=B+s|0;z=z+a|0;if(y){C=z+ -1|0;D=0;E=B-a|0;do{E=E+a|0;if(w){F=2;G=C;H=E;while(1){I=G+2|0;J=H+2|0;K=l+(G+1<<2)|0;L=H+1|0;M=f+(L<<2)|0;N=l+(I<<2)|0;O=f+(J<<2)|0;g[j+(L<<2)>>2]=+g[K>>2]*+g[M>>2]+ +g[N>>2]*+g[O>>2];g[j+(J<<2)>>2]=+g[K>>2]*+g[O>>2]- +g[N>>2]*+g[M>>2];M=F+2|0;if((M|0)<(a|0)){H=J;G=I;F=M}else{break}}}D=D+1|0;}while((D|0)<(c|0))}A=A+1|0;}while((A|0)<(b|0))}else{if(!v){break}A=(a|0)>2;w=(c|0)>0;B=x;z=1;y=0;do{B=B+a|0;y=y+s|0;if(A){D=2;E=B+ -1|0;C=y;while(1){F=E+2|0;G=C+2|0;if(w){H=l+(E+1<<2)|0;M=l+(F<<2)|0;I=0;J=G;while(1){N=J+ -1|0;O=f+(N<<2)|0;K=f+(J<<2)|0;g[j+(N<<2)>>2]=+g[H>>2]*+g[O>>2]+ +g[M>>2]*+g[K>>2];g[j+(J<<2)>>2]=+g[H>>2]*+g[K>>2]- +g[M>>2]*+g[O>>2];O=I+1|0;if((O|0)<(c|0)){J=J+a|0;I=O}else{break}}}I=D+2|0;if((I|0)<(a|0)){D=I;C=G;E=F}else{break}}}z=z+1|0;}while((z|0)<(b|0))}}while(0);x=$(s,b)|0;v=(q|0)>1;if((r|0)>=(c|0)){if(!v){break}z=(c|0)>0;w=(a|0)>2;y=1;B=0;A=x;while(1){B=B+s|0;A=A-s|0;if(z){E=0;C=B;D=A;while(1){if(w){I=2;J=C;M=D;while(1){H=J+2|0;O=M+2|0;K=J+1|0;N=j+(K<<2)|0;L=M+1|0;P=j+(L<<2)|0;g[f+(K<<2)>>2]=+g[N>>2]+ +g[P>>2];K=j+(H<<2)|0;Q=j+(O<<2)|0;g[f+(L<<2)>>2]=+g[K>>2]- +g[Q>>2];g[f+(H<<2)>>2]=+g[K>>2]+ +g[Q>>2];g[f+(O<<2)>>2]=+g[P>>2]- +g[N>>2];N=I+2|0;if((N|0)<(a|0)){M=O;J=H;I=N}else{break}}}I=E+1|0;if((I|0)<(c|0)){E=I;C=C+a|0;D=D+a|0}else{break}}}y=y+1|0;if((y|0)>=(q|0)){break a}}}if(!v){break}y=(a|0)>2;w=(c|0)>0;A=1;B=0;z=x;do{B=B+s|0;z=z-s|0;if(y){D=2;C=B;E=z;do{C=C+2|0;E=E+2|0;if(w){I=0;J=C-a|0;M=E-a|0;do{J=J+a|0;M=M+a|0;N=J+ -1|0;H=j+(N<<2)|0;O=M+ -1|0;P=j+(O<<2)|0;g[f+(N<<2)>>2]=+g[H>>2]+ +g[P>>2];N=j+(J<<2)|0;Q=j+(M<<2)|0;g[f+(O<<2)>>2]=+g[N>>2]- +g[Q>>2];g[f+(J<<2)>>2]=+g[N>>2]+ +g[Q>>2];g[f+(M<<2)>>2]=+g[P>>2]- +g[H>>2];I=I+1|0;}while((I|0)<(c|0))}D=D+2|0;}while((D|0)<(a|0))}A=A+1|0;}while((A|0)<(q|0))}}while(0);l=(d|0)>0;if(l){A=0;do{g[h+(A<<2)>>2]=+g[k+(A<<2)>>2];A=A+1|0;}while((A|0)<(d|0))}A=$(d,b)|0;w=(q|0)>1;do{if(w){z=(c|0)>0;B=1;y=0;x=A;do{y=y+s|0;x=x-s|0;if(z){v=0;D=y-a|0;E=x-a|0;do{D=D+a|0;E=E+a|0;C=j+(D<<2)|0;I=j+(E<<2)|0;g[f+(D<<2)>>2]=+g[C>>2]+ +g[I>>2];g[f+(E<<2)>>2]=+g[I>>2]- +g[C>>2];v=v+1|0;}while((v|0)<(c|0))}B=B+1|0;}while((B|0)<(q|0));B=$(b+ -1|0,d)|0;if(!w){break}x=(q|0)>2;n=0.0;T=1.0;y=1;z=0;v=A;while(1){E=z+d|0;D=v-d|0;U=o*T-p*n;V=o*n+p*T;if(l){C=0;I=E;M=D;J=B;H=d;while(1){g[k+(I<<2)>>2]=+g[h+(C<<2)>>2]+U*+g[h+(H<<2)>>2];g[k+(M<<2)>>2]=V*+g[h+(J<<2)>>2];P=C+1|0;if((P|0)<(d|0)){H=H+1|0;J=J+1|0;M=M+1|0;I=I+1|0;C=P}else{break}}}if(x){W=V;X=U;C=2;I=d;M=B;while(1){J=I+d|0;H=M-d|0;Y=U*X-V*W;Z=U*W+V*X;if(l){P=0;Q=E;N=D;O=J;K=H;while(1){L=k+(Q<<2)|0;g[L>>2]=+g[L>>2]+Y*+g[h+(O<<2)>>2];L=k+(N<<2)|0;g[L>>2]=+g[L>>2]+Z*+g[h+(K<<2)>>2];L=P+1|0;if((L|0)<(d|0)){K=K+1|0;O=O+1|0;N=N+1|0;Q=Q+1|0;P=L}else{break}}}P=C+1|0;if((P|0)<(q|0)){C=P;M=H;I=J;X=Y;W=Z}else{break}}}I=y+1|0;if((I|0)<(q|0)){y=I;v=D;z=E;T=U;n=V}else{break}}if(w){_=1;aa=0}else{break}do{aa=aa+d|0;if(l){z=0;v=aa;while(1){y=k+(z<<2)|0;g[y>>2]=+g[h+(v<<2)>>2]+ +g[y>>2];y=z+1|0;if((y|0)<(d|0)){v=v+1|0;z=y}else{break}}}_=_+1|0;}while((_|0)<(q|0))}}while(0);do{if((a|0)<(c|0)){if((a|0)<=0){break}_=(c|0)>0;d=0;do{if(_){h=0;k=d;aa=d;while(1){g[e+(aa<<2)>>2]=+g[j+(k<<2)>>2];l=h+1|0;if((l|0)<(c|0)){aa=aa+t|0;k=k+a|0;h=l}else{break}}}d=d+1|0;}while((d|0)<(a|0))}else{if((c|0)<=0){break}d=(a|0)>0;_=0;h=0;k=0;while(1){if(d){aa=0;l=h;A=k;while(1){g[e+(A<<2)>>2]=+g[j+(l<<2)>>2];f=aa+1|0;if((f|0)<(a|0)){A=A+1|0;l=l+1|0;aa=f}else{break}}}aa=_+1|0;if((aa|0)<(c|0)){_=aa;h=h+a|0;k=k+t|0}else{break}}}}while(0);k=a<<1;h=$(s,b)|0;if(w){b=(c|0)>0;_=1;d=0;aa=0;l=h;do{d=d+k|0;aa=aa+s|0;l=l-s|0;if(b){A=0;f=d;z=aa;v=l;while(1){g[e+(f+ -1<<2)>>2]=+g[j+(z<<2)>>2];g[e+(f<<2)>>2]=+g[j+(v<<2)>>2];E=A+1|0;if((E|0)<(c|0)){v=v+a|0;z=z+a|0;f=f+t|0;A=E}else{break}}}_=_+1|0;}while((_|0)<(q|0))}if(u){i=m;return}u=0-a|0;if((r|0)>=(c|0)){if(w){ba=1;ca=u;da=0;ea=0;fa=h}else{i=m;return}do{ca=ca+k|0;da=da+k|0;ea=ea+s|0;fa=fa-s|0;if(!((c|0)<1|(a|0)<3)){r=0;_=ca;l=da;aa=ea;d=fa;while(1){b=2;do{A=b+aa|0;f=j+(A+ -1<<2)|0;z=b+d|0;v=j+(z+ -1<<2)|0;E=b+l|0;g[e+(E+ -1<<2)>>2]=+g[f>>2]+ +g[v>>2];D=a-b+_|0;g[e+(D+ -1<<2)>>2]=+g[f>>2]- +g[v>>2];v=j+(A<<2)|0;A=j+(z<<2)|0;g[e+(E<<2)>>2]=+g[v>>2]+ +g[A>>2];g[e+(D<<2)>>2]=+g[A>>2]- +g[v>>2];b=b+2|0;}while((b|0)<(a|0));b=r+1|0;if((b|0)<(c|0)){r=b;_=_+t|0;l=l+t|0;aa=aa+a|0;d=d+a|0}else{break}}}ba=ba+1|0;}while((ba|0)<(q|0));i=m;return}if(!w){i=m;return}w=(a|0)>2;ba=(c|0)>0;fa=1;ea=u;u=0;da=0;ca=h;do{ea=ea+k|0;u=u+k|0;da=da+s|0;ca=ca-s|0;b:do{if(w){h=ea+a|0;if(ba){ga=2}else{d=2;while(1){d=d+2|0;if((d|0)>=(a|0)){break b}}}do{d=0;aa=h-ga|0;l=ga+u|0;_=ga+da|0;r=ga+ca|0;while(1){b=j+(_+ -1<<2)|0;v=j+(r+ -1<<2)|0;g[e+(l+ -1<<2)>>2]=+g[b>>2]+ +g[v>>2];g[e+(aa+ -1<<2)>>2]=+g[b>>2]- +g[v>>2];v=j+(_<<2)|0;b=j+(r<<2)|0;g[e+(l<<2)>>2]=+g[v>>2]+ +g[b>>2];g[e+(aa<<2)>>2]=+g[b>>2]- +g[v>>2];v=d+1|0;if((v|0)<(c|0)){r=r+a|0;_=_+a|0;l=l+t|0;aa=aa+t|0;d=v}else{break}}ga=ga+2|0;}while((ga|0)<(a|0))}}while(0);fa=fa+1|0;}while((fa|0)<(q|0));i=m;return}function md(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;d=i;e=(a|0)!=0;do{if(e){f=c[a+64>>2]|0;if((f|0)==0){g=1;h=0;j=0;k=1;l=0;break}m=c[f+104>>2]|0;n=c[f+4>>2]|0;if((n|0)==0){g=0;h=m;j=0;k=1;l=0;break}g=0;h=m;j=c[n+28>>2]|0;k=0;l=n}else{g=1;h=0;j=0;k=1;l=0}}while(0);n=e?a+4|0:0;if(g|(h|0)==0|k|(j|0)==0|(n|0)==0){o=-136;i=d;return o|0}fc(a);Eb(n,c[b>>2]|0,c[b+4>>2]|0);if((Hb(n,1)|0)!=0){o=-135;i=d;return o|0}k=Hb(n,c[h+44>>2]|0)|0;if((k|0)==-1){o=-136;i=d;return o|0}c[a+40>>2]=k;h=j+32+(k<<2)|0;k=c[h>>2]|0;if((k|0)==0){o=-136;i=d;return o|0}g=c[k>>2]|0;k=a+28|0;c[k>>2]=g;do{if((g|0)==0){c[a+24>>2]=0;c[a+32>>2]=0;p=0}else{c[a+24>>2]=Hb(n,1)|0;e=Hb(n,1)|0;c[a+32>>2]=e;if((e|0)==-1){o=-136;i=d;return o|0}else{p=c[k>>2]|0;break}}}while(0);k=b+16|0;n=c[k+4>>2]|0;g=a+48|0;c[g>>2]=c[k>>2];c[g+4>>2]=n;n=b+24|0;g=c[n+4>>2]|0;k=a+56|0;c[k>>2]=c[n>>2];c[k+4>>2]=g;c[a+44>>2]=c[b+12>>2];b=a+36|0;c[b>>2]=c[j+(p<<2)>>2];p=l+4|0;c[a>>2]=ec(a,c[p>>2]<<2)|0;if((c[p>>2]|0)>0){l=0;do{g=ec(a,c[b>>2]<<2)|0;c[(c[a>>2]|0)+(l<<2)>>2]=g;l=l+1|0;}while((l|0)<(c[p>>2]|0))}p=c[(c[h>>2]|0)+12>>2]|0;o=jb[c[(c[28072+(c[j+288+(p<<2)>>2]<<2)>>2]|0)+16>>2]&15](a,c[j+544+(p<<2)>>2]|0)|0;i=d;return o|0}function nd(a){a=a|0;i=i;return c[28192+(a<<2)>>2]|0}function od(a,b,d,e,f,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;j=i;k=(f|0)!=0;l=k?e:0;e=k?h:0;h=c[28192+(c[b+(l<<2)>>2]<<2)>>2]|0;k=c[28192+(c[b+(e<<2)>>2]<<2)>>2]|0;b=c[d+(f<<2)>>2]|0;f=c[d+(l<<2)>>2]|0;l=c[d+(e<<2)>>2]|0;e=(b|0)/4|0;d=e-((f|0)/4|0)|0;m=d+((f|0)/2|0)|0;f=((b|0)/2|0)+e+((l|0)/-4|0)|0;e=(l|0)/2|0;n=f+e|0;if((d|0)>0){hf(a|0,0,d<<2|0)|0;o=d}else{o=0}if((o|0)<(m|0)){d=o;o=0;while(1){p=a+(d<<2)|0;g[p>>2]=+g[h+(o<<2)>>2]*+g[p>>2];p=d+1|0;if((p|0)<(m|0)){o=o+1|0;d=p}else{break}}}if((l|0)>1){l=f+1|0;d=(n|0)>(l|0);o=f;m=e;do{m=m+ -1|0;e=a+(o<<2)|0;g[e>>2]=+g[k+(m<<2)>>2]*+g[e>>2];o=o+1|0;}while((o|0)<(n|0));q=d?n:l}else{q=f}if((q|0)>=(b|0)){i=j;return}hf(a+(q<<2)|0,0,b-q<<2|0)|0;i=j;return}function pd(a){a=a|0;var b=0,d=0;b=i;d=a+0|0;a=d+48|0;do{c[d>>2]=0;d=d+4|0}while((d|0)<(a|0));i=b;return}function qd(a){a=a|0;i=i;return(c[(c[(c[a+64>>2]|0)+104>>2]|0)+80>>2]|0)!=0|0}function rd(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;b=i;d=_e(1,40)|0;c[d+36>>2]=1;a:do{if((Hb(a,24)|0)==5653314){c[d>>2]=Hb(a,16)|0;e=Hb(a,24)|0;f=d+4|0;c[f>>2]=e;if((e|0)==-1){break}e=Zc(c[d>>2]|0)|0;if(((Zc(c[f>>2]|0)|0)+e|0)>24){break}e=Hb(a,1)|0;b:do{if((e|0)==0){g=Hb(a,1)|0;h=(g|0)!=0;g=($(h?1:5,c[f>>2]|0)|0)+7>>3;j=c[a+16>>2]|0;if((g|0)>(j-(Ib(a)|0)|0)){break a}j=c[f>>2]|0;g=d+8|0;c[g>>2]=Ye(j<<2)|0;k=(j|0)>0;if(!h){if(k){l=0}else{break}while(1){h=Hb(a,5)|0;if((h|0)==-1){break a}c[(c[g>>2]|0)+(l<<2)>>2]=h+1;l=l+1|0;if((l|0)>=(c[f>>2]|0)){break b}}}if(k){m=0}else{break}do{if((Hb(a,1)|0)==0){c[(c[g>>2]|0)+(m<<2)>>2]=0}else{h=Hb(a,5)|0;if((h|0)==-1){break a}c[(c[g>>2]|0)+(m<<2)>>2]=h+1}m=m+1|0;}while((m|0)<(c[f>>2]|0))}else if((e|0)==1){g=(Hb(a,5)|0)+1|0;if((g|0)==0){break a}k=c[f>>2]|0;h=d+8|0;c[h>>2]=Ye(k<<2)|0;if((k|0)>0){n=k;o=0;p=g}else{break}while(1){g=Hb(a,Zc(n-o|0)|0)|0;if((g|0)==-1|(p|0)>32){break a}k=c[f>>2]|0;if((g|0)>(k-o|0)){break a}if((g|0)>0){if((g+ -1>>p+ -1|0)>1){break a}j=c[h>>2]|0;q=o;r=0;while(1){c[j+(q<<2)>>2]=p;s=r+1|0;if((s|0)<(g|0)){r=s;q=q+1|0}else{break}}t=c[f>>2]|0;u=g+o|0}else{t=k;u=o}if((u|0)<(t|0)){n=t;o=u;p=p+1|0}else{break}}}else{break a}}while(0);e=Hb(a,4)|0;h=d+12|0;c[h>>2]=e;if((e|0)==0){v=d;i=b;return v|0}else if(!((e|0)==2|(e|0)==1)){break}c[d+16>>2]=Hb(a,32)|0;c[d+20>>2]=Hb(a,32)|0;e=d+24|0;c[e>>2]=(Hb(a,4)|0)+1;q=Hb(a,1)|0;c[d+28>>2]=q;if((q|0)==-1){break}q=c[h>>2]|0;do{if((q|0)==1){if((c[d>>2]|0)==0){w=0;break}w=$c(d)|0}else if((q|0)==2){w=$(c[d>>2]|0,c[f>>2]|0)|0}else{w=0}}while(0);f=($(c[e>>2]|0,w)|0)+7>>3;q=c[a+16>>2]|0;if((f|0)>(q-(Ib(a)|0)|0)){break}q=Ye(w<<2)|0;f=d+32|0;c[f>>2]=q;if((w|0)>0){h=0;while(1){r=Hb(a,c[e>>2]|0)|0;j=c[f>>2]|0;c[j+(h<<2)>>2]=r;r=h+1|0;if((r|0)<(w|0)){h=r}else{x=j;break}}}else{x=q}if((w|0)==0){v=d;i=b;return v|0}if((c[x+(w+ -1<<2)>>2]|0)==-1){break}else{v=d}i=b;return v|0}}while(0);bd(d);v=0;i=b;return v|0}function sd(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0;e=i;if((b|0)<0){f=0;i=e;return f|0}g=a+12|0;h=c[g>>2]|0;if((c[h+4>>2]|0)<=(b|0)){f=0;i=e;return f|0}Db(d,c[(c[a+20>>2]|0)+(b<<2)>>2]|0,c[(c[h+8>>2]|0)+(b<<2)>>2]|0);f=c[(c[(c[g>>2]|0)+8>>2]|0)+(b<<2)>>2]|0;i=e;return f|0}function td(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;if((c[a+8>>2]|0)<=0){e=-1;i=d;return e|0}f=ud(a,b)|0;if(!((f|0)>-1)){e=-1;i=d;return e|0}e=c[(c[a+24>>2]|0)+(f<<2)>>2]|0;i=d;return e|0}function ud(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;e=i;f=c[b+40>>2]|0;g=Fb(d,c[b+36>>2]|0)|0;do{if((g|0)>-1){h=c[(c[b+32>>2]|0)+(g<<2)>>2]|0;if((h|0)<0){j=(c[b+8>>2]|0)-(h&32767)|0;k=h>>>15&32767;break}l=h+ -1|0;Gb(d,a[(c[b+28>>2]|0)+l|0]|0);m=l;i=e;return m|0}else{j=c[b+8>>2]|0;k=0}}while(0);g=Fb(d,f)|0;l=(g|0)<0;if(l&(f|0)>1){h=f;while(1){n=h+ -1|0;o=Fb(d,n)|0;p=(o|0)<0;if(p&(n|0)>1){h=n}else{q=p;r=o;s=n;break}}}else{q=l;r=g;s=f}if(q){m=-1;i=e;return m|0}q=r>>>16|r<<16;r=q>>>8&16711935|q<<8&-16711936;q=r>>>4&252645135|r<<4&-252645136;r=q>>>2&858993459|q<<2&-858993460;q=r>>>1&1431655765|r<<1&-1431655766;r=j-k|0;if((r|0)>1){f=c[b+20>>2]|0;g=r;r=j;j=k;while(1){l=g>>1;h=(c[f+(l+j<<2)>>2]|0)>>>0>q>>>0;n=(h?0:l)+j|0;o=r-(h?l:0)|0;l=o-n|0;if((l|0)>1){j=n;r=o;g=l}else{t=n;break}}}else{t=k}k=a[(c[b+28>>2]|0)+t|0]|0;if((k|0)>(s|0)){Gb(d,s);m=-1;i=e;return m|0}else{Gb(d,k);m=t;i=e;return m|0}return 0}function vd(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;f=i;if((c[a+8>>2]|0)<=0){h=0;i=f;return h|0}j=c[a>>2]|0;k=(e|0)/(j|0)|0;e=i;i=i+((1*(k<<2)|0)+7&-8)|0;l=e;e=(k|0)>0;a:do{if(e){m=a+16|0;n=0;while(1){o=ud(a,d)|0;if((o|0)==-1){h=-1;break}p=c[a>>2]|0;c[l+(n<<2)>>2]=(c[m>>2]|0)+(($(p,o)|0)<<2);o=n+1|0;if((o|0)<(k|0)){n=o}else{q=p;break a}}i=f;return h|0}else{q=j}}while(0);if((q|0)<1|e^1){h=0;i=f;return h|0}else{r=0;s=0}while(1){e=0;do{j=b+(e+s<<2)|0;g[j>>2]=+g[(c[l+(e<<2)>>2]|0)+(r<<2)>>2]+ +g[j>>2];e=e+1|0;}while((e|0)<(k|0));e=r+1|0;if((e|0)<(q|0)){r=e;s=s+k|0}else{h=0;break}}i=f;return h|0}function wd(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0;f=i;if((c[a+8>>2]|0)<=0){h=0;i=f;return h|0}if((c[a>>2]|0)>8){if((e|0)<=0){h=0;i=f;return h|0}j=a+16|0;k=0;while(1){l=ud(a,d)|0;if((l|0)==-1){h=-1;m=23;break}n=c[j>>2]|0;o=c[a>>2]|0;p=$(o,l)|0;if((o|0)>0){l=(o|0)>1?o:1;q=k;r=0;while(1){s=r+1|0;t=b+(q<<2)|0;g[t>>2]=+g[n+(r+p<<2)>>2]+ +g[t>>2];if((s|0)<(o|0)){r=s;q=q+1|0}else{break}}u=k+l|0}else{u=k}if((u|0)<(e|0)){k=u}else{h=0;m=23;break}}if((m|0)==23){i=f;return h|0}}u=a+16|0;k=0;a:while(1){if((k|0)>=(e|0)){h=0;m=23;break}b:while(1){j=ud(a,d)|0;if((j|0)==-1){h=-1;m=23;break a}v=c[u>>2]|0;q=c[a>>2]|0;w=$(q,j)|0;switch(q|0){case 5:{x=k;y=0;m=15;break b;break};case 4:{z=k;A=0;m=16;break b;break};case 8:{m=12;break b;break};case 7:{B=k;C=0;m=13;break b;break};case 6:{D=k;E=0;m=14;break b;break};case 1:{F=k;G=0;break b;break};case 3:{H=k;I=0;m=17;break b;break};case 2:{J=k;K=0;m=18;break b;break};default:{}}}if((m|0)==12){m=0;l=b+(k<<2)|0;g[l>>2]=+g[v+(w<<2)>>2]+ +g[l>>2];B=k+1|0;C=1;m=13}if((m|0)==13){m=0;l=b+(B<<2)|0;g[l>>2]=+g[v+(C+w<<2)>>2]+ +g[l>>2];D=B+1|0;E=C+1|0;m=14}if((m|0)==14){m=0;l=b+(D<<2)|0;g[l>>2]=+g[v+(E+w<<2)>>2]+ +g[l>>2];x=D+1|0;y=E+1|0;m=15}if((m|0)==15){m=0;l=b+(x<<2)|0;g[l>>2]=+g[v+(y+w<<2)>>2]+ +g[l>>2];z=x+1|0;A=y+1|0;m=16}if((m|0)==16){m=0;l=b+(z<<2)|0;g[l>>2]=+g[v+(A+w<<2)>>2]+ +g[l>>2];H=z+1|0;I=A+1|0;m=17}if((m|0)==17){m=0;l=b+(H<<2)|0;g[l>>2]=+g[v+(I+w<<2)>>2]+ +g[l>>2];J=H+1|0;K=I+1|0;m=18}if((m|0)==18){m=0;l=b+(J<<2)|0;g[l>>2]=+g[v+(K+w<<2)>>2]+ +g[l>>2];F=J+1|0;G=K+1|0}l=b+(F<<2)|0;g[l>>2]=+g[v+(G+w<<2)>>2]+ +g[l>>2];k=F+1|0}if((m|0)==23){i=f;return h|0}return 0}function xd(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;f=i;h=(e|0)>0;if((c[a+8>>2]|0)<=0){if(!h){j=0;i=f;return j|0}hf(b|0,0,e<<2|0)|0;j=0;i=f;return j|0}if(!h){j=0;i=f;return j|0}h=a+16|0;k=0;while(1){l=ud(a,d)|0;if((l|0)==-1){j=-1;m=11;break}n=c[h>>2]|0;o=c[a>>2]|0;p=$(o,l)|0;a:do{if((k|0)<(e|0)){l=k;q=0;while(1){if((q|0)>=(o|0)){r=l;break a}s=l+1|0;g[b+(l<<2)>>2]=+g[n+(q+p<<2)>>2];if((s|0)<(e|0)){l=s;q=q+1|0}else{r=s;break}}}else{r=k}}while(0);if((r|0)<(e|0)){k=r}else{j=0;m=11;break}}if((m|0)==11){i=f;return j|0}return 0}function yd(a,b,d,e,f,h){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;j=i;if((c[a+8>>2]|0)<=0){k=0;i=j;return k|0}l=(d|0)/(e|0)|0;m=(h+d|0)/(e|0)|0;if((l|0)>=(m|0)){k=0;i=j;return k|0}d=a+16|0;h=0;n=l;while(1){l=ud(a,f)|0;if((l|0)==-1){k=-1;o=8;break}p=c[d>>2]|0;q=c[a>>2]|0;r=$(q,l)|0;if((q|0)>0){l=h;s=n;t=0;while(1){u=l+1|0;v=(c[b+(l<<2)>>2]|0)+(s<<2)|0;g[v>>2]=+g[p+(t+r<<2)>>2]+ +g[v>>2];v=(u|0)==(e|0);w=(v&1)+s|0;x=v?0:u;u=t+1|0;if((u|0)<(q|0)){t=u;s=w;l=x}else{y=x;z=w;break}}}else{y=h;z=n}if((z|0)<(m|0)){h=y;n=z}else{k=0;o=8;break}}if((o|0)==8){i=j;return k|0}return 0}function zd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;d=i;e=c[a+28>>2]|0;a=Ye(96)|0;f=Hb(b,8)|0;c[a>>2]=f;g=Hb(b,16)|0;c[a+4>>2]=g;h=Hb(b,16)|0;c[a+8>>2]=h;c[a+12>>2]=Hb(b,6)|0;c[a+16>>2]=Hb(b,8)|0;j=Hb(b,4)|0;k=a+20|0;c[k>>2]=j+1;a:do{if(!((f|0)<1|(g|0)<1)){if((h|0)<1|(j|0)<0){break}if(!((j|0)>-1)){l=a;i=d;return l|0}m=a+24|0;n=e+24|0;o=e+1824|0;p=0;while(1){q=Hb(b,8)|0;c[m+(p<<2)>>2]=q;if((q|0)<0){break a}if((q|0)>=(c[n>>2]|0)){break a}r=c[o+(q<<2)>>2]|0;if((c[r+12>>2]|0)==0){break a}q=p+1|0;if((c[r>>2]|0)<1){break a}if((q|0)<(c[k>>2]|0)){p=q}else{l=a;break}}i=d;return l|0}}while(0);if((a|0)==0){l=0;i=d;return l|0}Ze(a);l=0;i=d;return l|0}function Ad(a,b){a=a|0;b=b|0;var d=0;a=i;d=_e(1,32)|0;c[d+4>>2]=c[b>>2];c[d>>2]=c[b+8>>2];c[d+20>>2]=b;c[d+8>>2]=_e(2,4)|0;i=a;return d|0}function Bd(a){a=a|0;var b=0;b=i;if((a|0)!=0){Ze(a)}i=b;return}function Cd(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0;b=i;if((a|0)==0){i=b;return}d=a+8|0;e=c[d>>2]|0;if((e|0)!=0){f=c[e>>2]|0;if((f|0)==0){g=e}else{Ze(f);g=c[d>>2]|0}f=c[g+4>>2]|0;if((f|0)==0){h=g}else{Ze(f);h=c[d>>2]|0}Ze(h)}Ze(a);i=b;return}function Dd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0.0,m=0.0,n=0,o=0,p=0;d=i;e=c[b+20>>2]|0;f=a+4|0;h=e+12|0;j=Hb(f,c[h>>2]|0)|0;if((j|0)<=0){k=0;i=d;return k|0}l=+(j|0)/+((1<<c[h>>2])+ -1|0)*+(c[e+16>>2]|0);h=e+20|0;j=Hb(f,Zc(c[h>>2]|0)|0)|0;if((j|0)==-1){k=0;i=d;return k|0}if((j|0)>=(c[h>>2]|0)){k=0;i=d;return k|0}h=(c[(c[(c[(c[a+64>>2]|0)+4>>2]|0)+28>>2]|0)+2848>>2]|0)+((c[e+24+(j<<2)>>2]|0)*56|0)|0;j=b+4|0;b=ec(a,((c[h>>2]|0)+(c[j>>2]|0)<<2)+4|0)|0;if((xd(h,b,f,c[j>>2]|0)|0)==-1){k=0;i=d;return k|0}f=c[j>>2]|0;if((f|0)>0){j=0;m=0.0;while(1){a:do{if((j|0)<(f|0)){a=c[h>>2]|0;e=j;n=0;while(1){if((n|0)>=(a|0)){o=e;break a}p=b+(e<<2)|0;g[p>>2]=m+ +g[p>>2];p=e+1|0;if((p|0)<(f|0)){e=p;n=n+1|0}else{o=p;break}}}else{o=j}}while(0);if((o|0)<(f|0)){j=o;m=+g[b+(o+ -1<<2)>>2]}else{break}}}g[b+(f<<2)>>2]=l;k=b;i=d;return k|0}function Ed(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0.0,p=0.0,q=0.0,r=0.0,s=0,t=0,u=0,v=0;f=i;h=c[b+20>>2]|0;j=c[a+28>>2]|0;k=b+8|0;l=(c[k>>2]|0)+(j<<2)|0;if((c[l>>2]|0)==0){m=c[(c[(c[(c[a+64>>2]|0)+4>>2]|0)+28>>2]|0)+(j<<2)>>2]|0;a=(m|0)/2|0;n=c[b>>2]|0;o=+(c[h+4>>2]|0);p=o*.5;c[l>>2]=Ye((a<<2)+4|0)|0;if((m|0)>1){q=p/+(a|0);r=+(n|0)/(o*4999999873689376.0e-20+(+W(+(p*p*1.8499999754340024e-8))*2.240000009536743+ +W(+(o*.0003699999942909926))*13.100000381469727));m=c[(c[k>>2]|0)+(j<<2)>>2]|0;l=n;n=0;while(1){o=q*+(n|0);s=~~+N(+(r*(o*9999999747378752.0e-20+(+W(+(o*.0007399999885819852))*13.100000381469727+ +W(+(o*o*1.8499999754340024e-8))*2.240000009536743))));c[m+(n<<2)>>2]=(s|0)<(l|0)?s:l+ -1|0;s=n+1|0;if((s|0)>=(a|0)){break}l=c[b>>2]|0;n=s}t=m;u=(a|0)>1?a:1}else{t=c[(c[k>>2]|0)+(j<<2)>>2]|0;u=0}c[t+(u<<2)>>2]=-1;c[b+12+(j<<2)>>2]=a}if((d|0)==0){hf(e|0,0,c[b+12+(j<<2)>>2]<<2|0)|0;v=0;i=f;return v|0}else{a=c[b+4>>2]|0;Rd(e,c[(c[k>>2]|0)+(j<<2)>>2]|0,c[b+12+(j<<2)>>2]|0,c[b>>2]|0,d,a,+g[d+(a<<2)>>2],+(c[h+16>>2]|0));v=1;i=f;return v|0}return 0}function Fd(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0.0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0,Pa=0,Qa=0,Ra=0,Sa=0,Ta=0,Ua=0,Va=0,Wa=0,Xa=0,Ya=0,Za=0,_a=0,ab=0,bb=0.0,cb=0.0,db=0.0,eb=0,fb=0,gb=0,hb=0.0,ib=0,jb=0,kb=0,lb=0,mb=0,nb=0,ob=0;f=i;i=i+4952|0;h=f;j=h;k=f+3584|0;l=k;m=f+3848|0;n=m;o=f+4112|0;p=o;q=f+4376|0;r=f+4640|0;s=r;t=f+4904|0;u=t;v=f+4912|0;w=v;x=f+4920|0;y=x;z=f+4928|0;A=z;B=f+4936|0;C=B;D=f+4944|0;E=D;F=c[b+1296>>2]|0;G=c[b+1288>>2]|0;H=c[b+1284>>2]|0;I=(H|0)>0;do{if(I){J=0;do{c[l+(J<<2)>>2]=-200;J=J+1|0;}while((J|0)<(H|0));if(I){K=0}else{break}do{c[n+(K<<2)>>2]=-200;K=K+1|0;}while((K|0)<(H|0));if(!I){break}hf(o|0,0,H<<2|0)|0;J=0;do{c[q+(J<<2)>>2]=1;J=J+1|0;}while((J|0)<(H|0));if(!I){break}hf(r|0,-1,H<<2|0)|0}}while(0);if((H|0)==0){L=h+0|0;M=L+56|0;do{c[L>>2]=0;L=L+4|0}while((L|0)<(M|0));c[h>>2]=0;c[j+4>>2]=G;h=G+ -1|0;if((G|0)<1){N=0;O=0;P=0;Q=0;R=0;S=0;T=0;U=0;V=0;W=0;X=0;Y=0}else{r=F+1112|0;I=0;o=0;K=0;J=0;Z=0;_=0;aa=0;ba=0;ca=0;da=0;ea=0;fa=0;ga=0;while(1){ha=+g[e+(I<<2)>>2];ia=~~(ha*7.314285755157471+1023.5);if((ia|0)>1023){ja=1023;ka=17}else{la=(ia|0)<0?0:ia;if((la|0)==0){ma=o;na=K;oa=J;pa=Z;qa=_;ra=aa;sa=ba;ta=ca;ua=da;va=ea;wa=fa;xa=ga}else{ja=la;ka=17}}do{if((ka|0)==17){ka=0;if(!(+g[d+(I<<2)>>2]+ +g[r>>2]>=ha)){ma=o;na=K+1|0;oa=J;pa=($(I,I)|0)+Z|0;qa=_;ra=I+aa|0;sa=ba;ta=($(ja,I)|0)+ca|0;ua=da;va=($(ja,ja)|0)+ea|0;wa=fa;xa=ja+ga|0;break}else{ma=o+1|0;na=K;oa=($(I,I)|0)+J|0;pa=Z;qa=I+_|0;ra=aa;sa=($(ja,I)|0)+ba|0;ta=ca;ua=($(ja,ja)|0)+da|0;va=ea;wa=ja+fa|0;xa=ga;break}}}while(0);if((I|0)<(h|0)){I=I+1|0;o=ma;K=na;J=oa;Z=pa;_=qa;aa=ra;ba=sa;ca=ta;da=ua;ea=va;fa=wa;ga=xa}else{N=ma;O=na;P=oa;Q=pa;R=qa;S=ra;T=sa;U=ta;V=ua;W=va;X=wa;Y=xa;break}}}c[j+8>>2]=R;c[j+12>>2]=X;c[j+16>>2]=P;c[j+20>>2]=V;c[j+24>>2]=T;c[j+28>>2]=N;c[j+32>>2]=S;c[j+36>>2]=Y;c[j+40>>2]=Q;c[j+44>>2]=W;c[j+48>>2]=U;c[j+52>>2]=O;ya=N}else{N=H+ -1|0;if((N|0)<=0){za=0;i=f;return za|0}O=G+ -1|0;U=F+1112|0;W=c[b>>2]|0;Q=0;Y=0;while(1){S=Q+1|0;T=c[b+(S<<2)>>2]|0;V=j+(Q*56|0)|0;L=V+0|0;M=L+56|0;do{c[L>>2]=0;L=L+4|0}while((L|0)<(M|0));c[V>>2]=W;c[j+(Q*56|0)+4>>2]=T;P=(T|0)<(G|0)?T:O;if((P|0)<(W|0)){Aa=0;Ba=0;Ca=0;Da=0;Ea=0;Fa=0;Ga=0;Ha=0;Ia=0;Ja=0;Ka=0;La=0}else{X=W;R=0;xa=0;wa=0;va=0;ua=0;ta=0;sa=0;ra=0;qa=0;pa=0;oa=0;na=0;while(1){ha=+g[e+(X<<2)>>2];ma=~~(ha*7.314285755157471+1023.5);if((ma|0)>1023){Ma=1023;ka=25}else{ga=(ma|0)<0?0:ma;if((ga|0)==0){Na=R;Oa=xa;Pa=wa;Qa=va;Ra=ua;Sa=ta;Ta=sa;Ua=ra;Va=qa;Wa=pa;Xa=oa;Ya=na}else{Ma=ga;ka=25}}do{if((ka|0)==25){ka=0;if(!(+g[d+(X<<2)>>2]+ +g[U>>2]>=ha)){Na=R;Oa=xa+1|0;Pa=wa;Qa=($(X,X)|0)+va|0;Ra=ua;Sa=X+ta|0;Ta=sa;Ua=($(Ma,X)|0)+ra|0;Va=qa;Wa=($(Ma,Ma)|0)+pa|0;Xa=oa;Ya=Ma+na|0;break}else{Na=R+1|0;Oa=xa;Pa=($(X,X)|0)+wa|0;Qa=va;Ra=X+ua|0;Sa=ta;Ta=($(Ma,X)|0)+sa|0;Ua=ra;Va=($(Ma,Ma)|0)+qa|0;Wa=pa;Xa=Ma+oa|0;Ya=na;break}}}while(0);if((X|0)<(P|0)){X=X+1|0;R=Na;xa=Oa;wa=Pa;va=Qa;ua=Ra;ta=Sa;sa=Ta;ra=Ua;qa=Va;pa=Wa;oa=Xa;na=Ya}else{Aa=Na;Ba=Oa;Ca=Pa;Da=Qa;Ea=Ra;Fa=Sa;Ga=Ta;Ha=Ua;Ia=Va;Ja=Wa;Ka=Xa;La=Ya;break}}}c[j+(Q*56|0)+8>>2]=Ea;c[j+(Q*56|0)+12>>2]=Ka;c[j+(Q*56|0)+16>>2]=Ca;c[j+(Q*56|0)+20>>2]=Ia;c[j+(Q*56|0)+24>>2]=Ga;c[j+(Q*56|0)+28>>2]=Aa;c[j+(Q*56|0)+32>>2]=Fa;c[j+(Q*56|0)+36>>2]=La;c[j+(Q*56|0)+40>>2]=Da;c[j+(Q*56|0)+44>>2]=Ja;c[j+(Q*56|0)+48>>2]=Ha;c[j+(Q*56|0)+52>>2]=Ba;na=Aa+Y|0;if((S|0)<(N|0)){Y=na;Q=S;W=T}else{ya=na;break}}}if((ya|0)==0){za=0;i=f;return za|0}c[t>>2]=-200;c[v>>2]=-200;Gd(j,H+ -1|0,u,w,F)|0;w=c[t>>2]|0;c[k>>2]=w;c[m>>2]=w;t=c[v>>2]|0;v=n+4|0;c[v>>2]=t;u=l+4|0;c[u>>2]=t;t=(H|0)>2;do{if(t){ya=F+1112|0;W=F+1096|0;Q=F+1100|0;Y=F+1104|0;N=2;a:while(1){Aa=c[b+520+(N<<2)>>2]|0;Ba=c[p+(Aa<<2)>>2]|0;Ha=c[q+(Aa<<2)>>2]|0;Ja=s+(Ba<<2)|0;b:do{if((c[Ja>>2]|0)!=(Ha|0)){Da=c[b+520+(Ba<<2)>>2]|0;La=c[b+520+(Ha<<2)>>2]|0;c[Ja>>2]=Ha;Fa=c[F+836+(Ba<<2)>>2]|0;Ga=c[F+836+(Ha<<2)>>2]|0;Ia=c[l+(Ba<<2)>>2]|0;Ca=n+(Ba<<2)|0;Ka=c[Ca>>2]|0;do{if((Ia|0)<0){Za=Ka}else{if((Ka|0)<0){Za=Ia;break}Za=Ka+Ia>>1}}while(0);Ia=l+(Ha<<2)|0;Ka=c[Ia>>2]|0;Ea=c[n+(Ha<<2)>>2]|0;do{if((Ka|0)<0){_a=Ea}else{if((Ea|0)<0){_a=Ka;break}_a=Ea+Ka>>1}}while(0);if((Za|0)==-1|(_a|0)==-1){ka=41;break a}Ka=_a-Za|0;Ea=Ga-Fa|0;Ya=(Ka|0)/(Ea|0)|0;Xa=Ka>>31|1;ha=+g[e+(Fa<<2)>>2];Wa=~~(ha*7.314285755157471+1023.5);if((Wa|0)>1023){ab=1023}else{ab=(Wa|0)<0?0:Wa}Wa=$(Ya,Ea)|0;Va=((Ka|0)>-1?Ka:0-Ka|0)-((Wa|0)>-1?Wa:0-Wa|0)|0;Wa=Za-ab|0;Ka=$(Wa,Wa)|0;bb=+g[ya>>2];do{if(!(+g[d+(Fa<<2)>>2]+bb>=ha)){ka=47}else{cb=+(Za|0);db=+(ab|0);if(cb+ +g[W>>2]<db){break}if(!(cb- +g[Q>>2]>db)){ka=47}}}while(0);c:do{if((ka|0)==47){ka=0;Wa=Fa+1|0;if((Wa|0)<(Ga|0)){Ua=Wa;Wa=0;Ta=Ka;Sa=1;Ra=Za;while(1){Qa=Wa+Va|0;Pa=(Qa|0)<(Ea|0);Oa=Qa-(Pa?0:Ea)|0;Qa=Ra+Ya+(Pa?0:Xa)|0;ha=+g[e+(Ua<<2)>>2];Pa=~~(ha*7.314285755157471+1023.5);if((Pa|0)>1023){eb=1023}else{eb=(Pa|0)<0?0:Pa}Pa=Qa-eb|0;Na=($(Pa,Pa)|0)+Ta|0;Pa=Sa+1|0;if(!(!(bb+ +g[d+(Ua<<2)>>2]>=ha)|(eb|0)==0)){ha=+(Qa|0);db=+(eb|0);if(ha+ +g[W>>2]<db){break c}if(ha- +g[Q>>2]>db){break c}}Ma=Ua+1|0;if((Ma|0)<(Ga|0)){Ua=Ma;Ta=Na;Sa=Pa;Ra=Qa;Wa=Oa}else{fb=Na;gb=Pa;break}}}else{fb=Ka;gb=1}db=+g[W>>2];ha=+(gb|0);cb=+g[Y>>2];do{if(!(db*db/ha>cb)){hb=+g[Q>>2];if(hb*hb/ha>cb){break}if(+((fb|0)/(gb|0)|0|0)>cb){break c}}}while(0);c[l+(N<<2)>>2]=-200;c[n+(N<<2)>>2]=-200;break b}}while(0);c[x>>2]=-200;c[z>>2]=-200;c[B>>2]=-200;c[D>>2]=-200;Ka=Gd(j+(Da*56|0)|0,Aa-Da|0,y,A,F)|0;Ga=Gd(j+(Aa*56|0)|0,La-Aa|0,C,E,F)|0;Xa=(Ka|0)!=0;if(Xa){c[x>>2]=Za;c[z>>2]=c[B>>2]}do{if((Ga|0)!=0){c[B>>2]=c[z>>2];c[D>>2]=_a;if(!Xa){break}c[l+(N<<2)>>2]=-200;c[n+(N<<2)>>2]=-200;break b}}while(0);Xa=c[x>>2]|0;c[Ca>>2]=Xa;if((Ba|0)==0){c[k>>2]=Xa}Xa=c[z>>2]|0;c[l+(N<<2)>>2]=Xa;Ga=c[B>>2]|0;c[n+(N<<2)>>2]=Ga;La=c[D>>2]|0;c[Ia>>2]=La;if((Ha|0)==1){c[v>>2]=La}if(!((Xa&Ga|0)>-1)){break}d:do{if((Aa|0)>0){Ga=Aa;do{Ga=Ga+ -1|0;Xa=q+(Ga<<2)|0;if((c[Xa>>2]|0)!=(Ha|0)){break d}c[Xa>>2]=N;}while((Ga|0)>0)}}while(0);Ia=Aa+1|0;if((Ia|0)<(H|0)){ib=Ia}else{break}do{Ia=p+(ib<<2)|0;if((c[Ia>>2]|0)!=(Ba|0)){break b}c[Ia>>2]=N;ib=ib+1|0;}while((ib|0)<(H|0))}}while(0);Ba=N+1|0;if((Ba|0)<(H|0)){N=Ba}else{ka=75;break}}if((ka|0)==41){$a(1)}else if((ka|0)==75){jb=c[m>>2]|0;kb=c[k>>2]|0;break}}else{jb=w;kb=w}}while(0);w=ec(a,H<<2)|0;do{if((kb|0)<0){lb=jb}else{if((jb|0)<0){lb=kb;break}lb=jb+kb>>1}}while(0);c[w>>2]=lb;lb=c[u>>2]|0;u=c[v>>2]|0;do{if((lb|0)<0){mb=u}else{if((u|0)<0){mb=lb;break}mb=u+lb>>1}}while(0);c[w+4>>2]=mb;if(t){nb=2}else{za=w;i=f;return za|0}while(1){t=nb+ -2|0;mb=c[b+1032+(t<<2)>>2]|0;lb=c[b+780+(t<<2)>>2]|0;t=c[F+836+(mb<<2)>>2]|0;u=c[w+(mb<<2)>>2]&32767;mb=(c[w+(lb<<2)>>2]&32767)-u|0;v=($((mb|0)>-1?mb:0-mb|0,(c[F+836+(nb<<2)>>2]|0)-t|0)|0)/((c[F+836+(lb<<2)>>2]|0)-t|0)|0;t=((mb|0)<0?0-v|0:v)+u|0;u=c[l+(nb<<2)>>2]|0;v=c[n+(nb<<2)>>2]|0;do{if((u|0)<0){ob=v}else{if((v|0)<0){ob=u;break}ob=v+u>>1}}while(0);if((ob|0)<0|(t|0)==(ob|0)){c[w+(nb<<2)>>2]=t|32768}else{c[w+(nb<<2)>>2]=ob}u=nb+1|0;if((u|0)<(H|0)){nb=u}else{za=w;break}}i=f;return za|0}function Gd(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var h=0,j=0,k=0,l=0.0,m=0.0,n=0.0,o=0.0,p=0.0,q=0.0,r=0,s=0,t=0.0,u=0.0,v=0.0,w=0.0,x=0.0,y=0.0,z=0.0,A=0.0,B=0.0,C=0.0,D=0.0,E=0.0,F=0.0,G=0.0,H=0.0,I=0.0,J=0.0,K=0.0,L=0.0,M=0.0,N=0.0,O=0,P=0,Q=0,R=0,S=0,T=0;h=i;j=c[a>>2]|0;k=c[a+((b+ -1|0)*56|0)+4>>2]|0;if((b|0)>0){l=+g[f+1108>>2];m=0.0;f=0;n=0.0;o=0.0;p=0.0;q=0.0;while(1){r=c[a+(f*56|0)+52>>2]|0;s=c[a+(f*56|0)+28>>2]|0;t=l*+(s+r|0)/+(s+1|0)+1.0;u=o+(+(c[a+(f*56|0)+32>>2]|0)+t*+(c[a+(f*56|0)+8>>2]|0));v=q+(+(c[a+(f*56|0)+36>>2]|0)+t*+(c[a+(f*56|0)+12>>2]|0));w=n+(+(c[a+(f*56|0)+40>>2]|0)+t*+(c[a+(f*56|0)+16>>2]|0));x=p+(+(c[a+(f*56|0)+48>>2]|0)+t*+(c[a+(f*56|0)+24>>2]|0));y=m+(+(r|0)+ +(s|0)*t);s=f+1|0;if((s|0)<(b|0)){q=v;p=x;o=u;n=w;f=s;m=y}else{z=y;A=w;B=u;C=x;D=v;break}}}else{z=0.0;A=0.0;B=0.0;C=0.0;D=0.0}f=c[d>>2]|0;if((f|0)>-1){E=z+1.0;F=+($(j,j)|0)+A;G=+(j|0)+B;H=C+ +($(f,j)|0);I=D+ +(f|0)}else{E=z;F=A;G=B;H=C;I=D}f=c[e>>2]|0;if((f|0)>-1){J=E+1.0;K=+($(k,k)|0)+F;L=+(k|0)+G;M=H+ +($(f,k)|0);N=I+ +(f|0)}else{J=E;K=F;L=G;M=H;N=I}I=J*K-L*L;if(!(I>0.0)){c[d>>2]=0;c[e>>2]=0;O=1;i=h;return O|0}H=(K*N-M*L)/I;K=(J*M-N*L)/I;c[d>>2]=~~+Ja(+(H+ +(j|0)*K));j=~~+Ja(+(H+ +(k|0)*K));c[e>>2]=j;k=c[d>>2]|0;if((k|0)>1023){c[d>>2]=1023;P=1023;Q=c[e>>2]|0}else{P=k;Q=j}if((Q|0)>1023){c[e>>2]=1023;R=1023;S=c[d>>2]|0}else{R=Q;S=P}if((S|0)<0){c[d>>2]=0;T=c[e>>2]|0}else{T=R}if((T|0)>=0){O=0;i=h;return O|0}c[e>>2]=0;O=0;i=h;return O|0}function Hd(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;g=i;h=c[b+1284>>2]|0;if((d|0)==0|(e|0)==0){j=0;i=g;return j|0}b=ec(a,h<<2)|0;if((h|0)<=0){j=b;i=g;return j|0}a=65536-f|0;k=0;while(1){l=d+(k<<2)|0;m=$(c[l>>2]&32767,a)|0;n=e+(k<<2)|0;o=m+32768+($(c[n>>2]&32767,f)|0)>>16;m=b+(k<<2)|0;c[m>>2]=o;do{if((c[l>>2]&32768|0)!=0){if((c[n>>2]&32768|0)==0){break}c[m>>2]=o|32768}}while(0);o=k+1|0;if((o|0)<(h|0)){k=o}else{j=b;break}}i=g;return j|0}function Id(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0;g=i;i=i+328|0;h=g;j=h;k=g+264|0;l=k;m=g+296|0;n=c[d+1296>>2]|0;o=d+1284|0;p=c[o>>2]|0;q=c[(c[(c[b+64>>2]|0)+4>>2]|0)+28>>2]|0;r=q+1824|0;s=c[q+2848>>2]|0;if((e|0)==0){Db(a,0,1);hf(f|0,0,((c[b+36>>2]|0)/2|0)<<2|0)|0;t=0;i=g;return t|0}if((p|0)>0){u=n+832|0;v=0;do{w=e+(v<<2)|0;x=c[w>>2]|0;y=x&32767;z=c[u>>2]|0;if((z|0)==4){A=y>>>4}else if((z|0)==1){A=y>>>2}else if((z|0)==3){A=(y>>>0)/12|0}else if((z|0)==2){A=y>>>3}else{A=y}c[w>>2]=x&32768|A;v=v+1|0;}while((v|0)<(p|0))}c[h>>2]=c[e>>2];v=j+4|0;c[v>>2]=c[e+4>>2];A=d+1292|0;if((p|0)>2){u=2;do{x=u+ -2|0;w=c[d+1032+(x<<2)>>2]|0;y=c[d+780+(x<<2)>>2]|0;x=c[n+836+(w<<2)>>2]|0;z=e+(w<<2)|0;w=e+(y<<2)|0;B=c[z>>2]&32767;C=(c[w>>2]&32767)-B|0;D=($((C|0)>-1?C:0-C|0,(c[n+836+(u<<2)>>2]|0)-x|0)|0)/((c[n+836+(y<<2)>>2]|0)-x|0)|0;x=((C|0)<0?0-D|0:D)+B|0;D=e+(u<<2)|0;C=c[D>>2]|0;if((C&32768|0)!=0|(x|0)==(C|0)){c[D>>2]=x|32768;c[j+(u<<2)>>2]=0}else{D=(c[A>>2]|0)-x|0;y=(D|0)<(x|0)?D:x;D=C-x|0;do{if((D|0)<0){if((D|0)<(0-y|0)){E=y+~D|0;break}else{E=~(D<<1);break}}else{if((D|0)<(y|0)){E=D<<1;break}else{E=y+D|0;break}}}while(0);c[j+(u<<2)>>2]=E;c[z>>2]=B;c[w>>2]=c[w>>2]&32767}u=u+1|0;}while((u|0)<(p|0))}Db(a,1,1);p=d+1308|0;c[p>>2]=(c[p>>2]|0)+1;p=(c[A>>2]|0)+ -1|0;u=(p|0)==0;do{if(u){F=c[h>>2]|0;G=d+1304|0;H=0}else{E=p;D=0;do{D=D+1|0;E=E>>>1;}while((E|0)!=0);E=d+1304|0;c[E>>2]=(c[E>>2]|0)+(D<<1);w=c[h>>2]|0;if(u){F=w;G=E;H=0;break}else{I=p;J=0}while(1){B=J+1|0;z=I>>>1;if((z|0)==0){F=w;G=E;H=B;break}else{J=B;I=z}}}}while(0);Db(a,F,H);H=c[v>>2]|0;v=(c[A>>2]|0)+ -1|0;if((v|0)==0){K=0}else{A=v;v=0;while(1){F=v+1|0;I=A>>>1;if((I|0)==0){K=F;break}else{v=F;A=I}}}Db(a,H,K);if((c[n>>2]|0)>0){K=d+1300|0;H=0;A=2;while(1){v=c[n+4+(H<<2)>>2]|0;I=c[n+128+(v<<2)>>2]|0;F=c[n+192+(v<<2)>>2]|0;J=1<<F;c[k+0>>2]=0;c[k+4>>2]=0;c[k+8>>2]=0;c[k+12>>2]=0;c[k+16>>2]=0;c[k+20>>2]=0;c[k+24>>2]=0;c[k+28>>2]=0;if((F|0)!=0){p=(J|0)>0;if(p){u=0;do{h=c[n+320+(v<<5)+(u<<2)>>2]|0;if((h|0)<0){c[m+(u<<2)>>2]=1}else{c[m+(u<<2)>>2]=c[(c[r+(h<<2)>>2]|0)+4>>2]}u=u+1|0;}while((u|0)<(J|0))}a:do{if((I|0)>0){if(p){L=0;M=0;N=0}else{u=0;h=0;E=0;while(1){w=c[l+(E<<2)>>2]<<u|h;D=E+1|0;if((D|0)<(I|0)){E=D;h=w;u=u+F|0}else{O=w;break a}}}while(1){u=c[j+(N+A<<2)>>2]|0;h=0;while(1){E=h+1|0;if((u|0)<(c[m+(h<<2)>>2]|0)){P=41;break}if((E|0)<(J|0)){h=E}else{P=43;break}}if((P|0)==41){P=0;c[l+(N<<2)>>2]=h;Q=h}else if((P|0)==43){P=0;Q=c[l+(N<<2)>>2]|0}u=Q<<L|M;E=N+1|0;if((E|0)<(I|0)){L=L+F|0;M=u;N=E}else{O=u;break}}}else{O=0}}while(0);F=sd(s+((c[n+256+(v<<2)>>2]|0)*56|0)|0,O,a)|0;c[K>>2]=(c[K>>2]|0)+F}if((I|0)>0){F=0;do{J=c[n+320+(v<<5)+(c[l+(F<<2)>>2]<<2)>>2]|0;do{if((J|0)>-1){p=c[j+(F+A<<2)>>2]|0;if((p|0)>=(c[s+(J*56|0)+4>>2]|0)){break}u=sd(s+(J*56|0)|0,p,a)|0;c[G>>2]=(c[G>>2]|0)+u}}while(0);F=F+1|0;}while((F|0)<(I|0))}F=H+1|0;if((F|0)<(c[n>>2]|0)){H=F;A=I+A|0}else{break}}}A=n+832|0;H=$(c[A>>2]|0,c[e>>2]|0)|0;G=(c[q+(c[b+28>>2]<<2)>>2]|0)/2|0;if((c[o>>2]|0)>1){q=0;a=1;s=0;j=H;while(1){l=c[d+260+(a<<2)>>2]|0;K=c[e+(l<<2)>>2]|0;do{if((K&32767|0)==(K|0)){O=$(c[A>>2]|0,K)|0;N=c[n+836+(l<<2)>>2]|0;M=O-j|0;L=N-s|0;Q=(M|0)/(L|0)|0;P=M>>31|1;m=$(Q,L)|0;r=((M|0)>-1?M:0-M|0)-((m|0)>-1?m:0-m|0)|0;m=(G|0)>(N|0)?N:G;if((m|0)>(s|0)){c[f+(s<<2)>>2]=j}M=s+1|0;if((M|0)<(m|0)){R=M;S=0;T=j}else{U=N;V=N;W=O;break}while(1){M=S+r|0;k=(M|0)<(L|0);F=T+Q+(k?0:P)|0;c[f+(R<<2)>>2]=F;v=R+1|0;if((v|0)<(m|0)){T=F;S=M-(k?0:L)|0;R=v}else{U=N;V=N;W=O;break}}}else{U=q;V=s;W=j}}while(0);l=a+1|0;if((l|0)<(c[o>>2]|0)){q=U;a=l;s=V;j=W}else{X=U;Y=W;break}}}else{X=0;Y=H}H=b+36|0;if((X|0)<((c[H>>2]|0)/2|0|0)){Z=X}else{t=1;i=g;return t|0}while(1){c[f+(Z<<2)>>2]=Y;X=Z+1|0;if((X|0)<((c[H>>2]|0)/2|0|0)){Z=X}else{t=1;break}}i=g;return t|0}function Jd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;d=i;e=a+836|0;f=c[a+840>>2]|0;Db(b,c[a>>2]|0,5);do{if((c[a>>2]|0)>0){g=a+4|0;h=0;j=-1;do{k=g+(h<<2)|0;Db(b,c[k>>2]|0,4);l=c[k>>2]|0;j=(j|0)<(l|0)?l:j;h=h+1|0;}while((h|0)<(c[a>>2]|0));if(!((j|0)>-1)){break}h=a+128|0;g=a+192|0;l=a+256|0;k=a+320|0;m=0;while(1){Db(b,(c[h+(m<<2)>>2]|0)+ -1|0,3);n=g+(m<<2)|0;Db(b,c[n>>2]|0,2);if((c[n>>2]|0)==0){o=0}else{Db(b,c[l+(m<<2)>>2]|0,8);o=c[n>>2]|0}if((1<<o|0)>0){p=0;do{Db(b,(c[k+(m<<5)+(p<<2)>>2]|0)+1|0,8);p=p+1|0;}while((p|0)<(1<<c[n>>2]|0))}if((m|0)<(j|0)){m=m+1|0}else{break}}}}while(0);Db(b,(c[a+832>>2]|0)+ -1|0,2);o=(f|0)==0?0:f+ -1|0;if((o|0)==0){Db(b,0,4);q=0}else{f=o;m=0;do{m=m+1|0;f=f>>>1;}while((f|0)!=0);Db(b,m,4);m=o;o=0;while(1){f=o+1|0;j=m>>>1;if((j|0)==0){q=f;break}else{o=f;m=j}}}m=c[a>>2]|0;if((m|0)<=0){i=d;return}o=a+4|0;j=a+128|0;f=m;m=0;k=0;l=0;while(1){g=(c[j+(c[o+(k<<2)>>2]<<2)>>2]|0)+m|0;if((l|0)<(g|0)){h=l;do{Db(b,c[e+(h+2<<2)>>2]|0,q);h=h+1|0;}while((h|0)<(g|0));r=c[a>>2]|0;s=g}else{r=f;s=l}h=k+1|0;if((h|0)<(r|0)){f=r;k=h;l=s;m=g}else{break}}i=d;return}function Kd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;d=i;i=i+264|0;e=d;f=e;g=c[a+28>>2]|0;a=_e(1,1120)|0;h=Hb(b,5)|0;c[a>>2]=h;a:do{if((h|0)>0){j=a+4|0;k=0;l=-1;do{m=Hb(b,4)|0;c[j+(k<<2)>>2]=m;if((m|0)<0){break a}l=(l|0)<(m|0)?m:l;k=k+1|0;}while((k|0)<(c[a>>2]|0));if(!((l|0)>-1)){n=18;break}k=a+128|0;j=a+192|0;m=a+256|0;o=g+24|0;p=a+320|0;q=0;while(1){c[k+(q<<2)>>2]=(Hb(b,3)|0)+1;r=Hb(b,2)|0;s=j+(q<<2)|0;c[s>>2]=r;if((r|0)<0){break a}if((r|0)==0){t=c[m+(q<<2)>>2]|0}else{r=Hb(b,8)|0;c[m+(q<<2)>>2]=r;t=r}if((t|0)<0){n=36;break a}if((t|0)>=(c[o>>2]|0)){n=36;break a}if((1<<c[s>>2]|0)>0){r=0;do{u=Hb(b,8)|0;c[p+(q<<5)+(r<<2)>>2]=u+ -1;if((u|0)<0){break a}r=r+1|0;if((u|0)>(c[o>>2]|0)){n=36;break a}}while((r|0)<(1<<c[s>>2]|0))}if((q|0)<(l|0)){q=q+1|0}else{n=18;break}}}else{n=18}}while(0);b:do{if((n|0)==18){c[a+832>>2]=(Hb(b,2)|0)+1;t=Hb(b,4)|0;if((t|0)<0){break}g=c[a>>2]|0;do{if((g|0)>0){h=a+4|0;q=a+128|0;l=a+836|0;o=1<<t;p=g;m=0;j=0;k=0;while(1){v=(c[q+(c[h+(j<<2)>>2]<<2)>>2]|0)+m|0;if((v|0)>63){break b}if((k|0)<(v|0)){s=k;do{r=Hb(b,t)|0;c[l+(s+2<<2)>>2]=r;s=s+1|0;if(!((r|0)>-1&(r|0)<(o|0))){break b}}while((s|0)<(v|0));w=c[a>>2]|0;x=s}else{w=p;x=k}r=j+1|0;if((r|0)<(w|0)){p=w;j=r;k=x;m=v}else{break}}m=v+2|0;c[l>>2]=0;c[a+840>>2]=o;if((m|0)>0){y=f;z=l;A=m;break}Ya(f|0,m|0,4,13);B=a;i=d;return B|0}else{m=a+836|0;c[m>>2]=0;c[a+840>>2]=1<<t;y=f;z=m;A=2}}while(0);t=0;do{c[f+(t<<2)>>2]=z+(t<<2);t=t+1|0;}while((t|0)<(A|0));Ya(y|0,A|0,4,13);if((A|0)<=1){B=a;i=d;return B|0}t=c[c[e>>2]>>2]|0;g=1;while(1){m=c[c[f+(g<<2)>>2]>>2]|0;k=g+1|0;if((t|0)==(m|0)){n=36;break b}if((k|0)<(A|0)){g=k;t=m}else{B=a;break}}i=d;return B|0}}while(0);do{if((n|0)==36){if((a|0)==0){B=0}else{break}i=d;return B|0}}while(0);Ze(a);B=0;i=d;return B|0}function Ld(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;a=i;i=i+264|0;d=a;e=_e(1,1312)|0;c[e+1296>>2]=b;f=b+836|0;g=e+1288|0;c[g>>2]=c[b+840>>2];h=c[b>>2]|0;do{if((h|0)>0){j=b+4|0;k=b+128|0;l=0;m=0;do{m=(c[k+(c[j+(l<<2)>>2]<<2)>>2]|0)+m|0;l=l+1|0;}while((l|0)<(h|0));l=m+2|0;c[e+1284>>2]=l;if((l|0)>0){n=l;o=m;p=7;break}Ya(d|0,l|0,4,13);q=m}else{c[e+1284>>2]=2;n=2;o=0;p=7}}while(0);if((p|0)==7){p=0;do{c[d+(p<<2)>>2]=f+(p<<2);p=p+1|0;}while((p|0)<(n|0));Ya(d|0,n|0,4,13);p=e+260|0;h=0;do{c[p+(h<<2)>>2]=(c[d+(h<<2)>>2]|0)-f>>2;h=h+1|0;}while((h|0)<(n|0));h=e+260|0;d=e+520|0;p=0;do{c[d+(c[h+(p<<2)>>2]<<2)>>2]=p;p=p+1|0;}while((p|0)<(n|0));p=e+260|0;h=0;while(1){c[e+(h<<2)>>2]=c[f+(c[p+(h<<2)>>2]<<2)>>2];d=h+1|0;if((d|0)<(n|0)){h=d}else{q=o;break}}}o=c[b+832>>2]|0;if((o|0)==2){c[e+1292>>2]=128}else if((o|0)==3){c[e+1292>>2]=86}else if((o|0)==1){c[e+1292>>2]=256}else if((o|0)==4){c[e+1292>>2]=64}if((q|0)<=0){i=a;return e|0}o=e+1032|0;b=e+780|0;h=0;do{n=h+2|0;p=c[f+(n<<2)>>2]|0;if((n|0)>0){d=1;l=c[g>>2]|0;j=0;k=0;r=0;while(1){s=c[f+(j<<2)>>2]|0;t=(s|0)>(r|0)&(s|0)<(p|0);u=t?j:k;v=(s|0)<(l|0)&(s|0)>(p|0);w=v?j:d;x=j+1|0;if((x|0)<(n|0)){r=t?s:r;k=u;j=x;l=v?s:l;d=w}else{y=w;z=u;break}}}else{y=1;z=0}c[o+(h<<2)>>2]=z;c[b+(h<<2)>>2]=y;h=h+1|0;}while((h|0)<(q|0));i=a;return e|0}function Md(a){a=a|0;var b=0;b=i;if((a|0)!=0){Ze(a)}i=b;return}function Nd(a){a=a|0;var b=0;b=i;if((a|0)!=0){Ze(a)}i=b;return}function Od(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;e=c[b+1296>>2]|0;f=c[(c[(c[(c[a+64>>2]|0)+4>>2]|0)+28>>2]|0)+2848>>2]|0;g=a+4|0;if((Hb(g,1)|0)!=1){h=0;i=d;return h|0}j=b+1284|0;k=ec(a,c[j>>2]<<2)|0;a=b+1292|0;l=(c[a>>2]|0)+ -1|0;if((l|0)==0){m=0}else{n=l;l=0;while(1){o=l+1|0;p=n>>>1;if((p|0)==0){m=o;break}else{l=o;n=p}}}c[k>>2]=Hb(g,m)|0;m=(c[a>>2]|0)+ -1|0;if((m|0)==0){q=0}else{n=m;m=0;while(1){l=m+1|0;p=n>>>1;if((p|0)==0){q=l;break}else{m=l;n=p}}}c[k+4>>2]=Hb(g,q)|0;a:do{if((c[e>>2]|0)>0){q=0;n=2;b:while(1){m=c[e+4+(q<<2)>>2]|0;p=c[e+128+(m<<2)>>2]|0;l=c[e+192+(m<<2)>>2]|0;o=1<<l;if((l|0)==0){r=0}else{s=td(f+((c[e+256+(m<<2)>>2]|0)*56|0)|0,g)|0;if((s|0)==-1){h=0;t=29;break}else{r=s}}if((p|0)>0){s=o+ -1|0;o=r;u=0;do{v=c[e+320+(m<<5)+((o&s)<<2)>>2]|0;o=o>>l;if((v|0)>-1){w=td(f+(v*56|0)|0,g)|0;c[k+(u+n<<2)>>2]=w;if((w|0)==-1){h=0;t=29;break b}}else{c[k+(u+n<<2)>>2]=0}u=u+1|0;}while((u|0)<(p|0))}u=q+1|0;if((u|0)<(c[e>>2]|0)){q=u;n=p+n|0}else{break a}}if((t|0)==29){i=d;return h|0}}}while(0);if((c[j>>2]|0)<=2){h=k;i=d;return h|0}t=b+1032|0;g=b+780|0;b=2;while(1){f=b+ -2|0;r=t+(f<<2)|0;n=c[r>>2]|0;q=c[e+836+(n<<2)>>2]|0;u=g+(f<<2)|0;f=c[u>>2]|0;l=c[k+(n<<2)>>2]&32767;n=(c[k+(f<<2)>>2]&32767)-l|0;o=($((n|0)>-1?n:0-n|0,(c[e+836+(b<<2)>>2]|0)-q|0)|0)/((c[e+836+(f<<2)>>2]|0)-q|0)|0;q=((n|0)<0?0-o|0:o)+l|0;l=(c[a>>2]|0)-q|0;o=k+(b<<2)|0;n=c[o>>2]|0;if((n|0)==0){c[o>>2]=q|32768}else{do{if((n|0)<(((l|0)<(q|0)?l:q)<<1|0)){if((n&1|0)==0){x=n>>1;break}else{x=0-(n+1>>1)|0;break}}else{if((l|0)>(q|0)){x=n-q|0;break}else{x=~(n-l);break}}}while(0);c[o>>2]=x+q&32767;l=k+(c[r>>2]<<2)|0;c[l>>2]=c[l>>2]&32767;l=k+(c[u>>2]<<2)|0;c[l>>2]=c[l>>2]&32767}l=b+1|0;if((l|0)<(c[j>>2]|0)){b=l}else{h=k;break}}i=d;return h|0}function Pd(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0.0;f=i;h=c[b+1296>>2]|0;j=(c[(c[(c[(c[a+64>>2]|0)+4>>2]|0)+28>>2]|0)+(c[a+28>>2]<<2)>>2]|0)/2|0;if((d|0)==0){hf(e|0,0,j<<2|0)|0;k=0;i=f;return k|0}a=c[h+832>>2]|0;l=$(a,c[d>>2]|0)|0;if((l|0)<0){m=0}else{m=(l|0)>255?255:l}l=c[b+1284>>2]|0;if((l|0)>1){n=b+260|0;b=0;o=1;p=0;q=m;while(1){r=c[n+(o<<2)>>2]|0;s=c[d+(r<<2)>>2]|0;do{if((s&32767|0)==(s|0)){t=c[h+836+(r<<2)>>2]|0;u=$(a,s)|0;if((u|0)<0){v=0}else{v=(u|0)>255?255:u}u=v-q|0;w=t-p|0;x=(u|0)/(w|0)|0;y=u>>31|1;z=$(x,w)|0;A=((u|0)>-1?u:0-u|0)-((z|0)>-1?z:0-z|0)|0;z=(j|0)>(t|0)?t:j;if((z|0)>(p|0)){u=e+(p<<2)|0;g[u>>2]=+g[60928+(q<<2)>>2]*+g[u>>2]}u=p+1|0;if((u|0)<(z|0)){B=u;C=0;D=q}else{E=t;F=t;G=v;break}while(1){u=C+A|0;H=(u|0)<(w|0);I=D+x+(H?0:y)|0;J=e+(B<<2)|0;g[J>>2]=+g[60928+(I<<2)>>2]*+g[J>>2];J=B+1|0;if((J|0)<(z|0)){D=I;C=u-(H?0:w)|0;B=J}else{E=t;F=t;G=v;break}}}else{E=b;F=p;G=q}}while(0);s=o+1|0;if((s|0)<(l|0)){b=E;o=s;p=F;q=G}else{K=E;L=G;break}}}else{K=0;L=m}if((K|0)>=(j|0)){k=1;i=f;return k|0}M=+g[60928+(L<<2)>>2];L=K;while(1){K=e+(L<<2)|0;g[K>>2]=M*+g[K>>2];K=L+1|0;if((K|0)<(j|0)){L=K}else{k=1;break}}i=f;return k|0}function Qd(a,b){a=a|0;b=b|0;i=i;return(c[c[a>>2]>>2]|0)-(c[c[b>>2]>>2]|0)|0}function Rd(a,b,d,e,f,h,j,k){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;h=h|0;j=+j;k=+k;var l=0,m=0.0,n=0,o=0.0,p=0,q=0.0,r=0.0,s=0.0,t=0,u=0,v=0,w=0,x=0.0,y=0.0,z=0;l=i;m=3.141592653589793/+(e|0);if((h|0)>0){e=0;do{n=f+(e<<2)|0;g[n>>2]=+R(+(+g[n>>2]))*2.0;e=e+1|0;}while((e|0)<(h|0))}if((d|0)<=0){i=l;return}o=j;j=k;if((h|0)>1){p=0}else{e=0;while(1){n=c[b+(e<<2)>>2]|0;k=+R(+(m*+(n|0)))*2.0;if((h|0)==1){q=(k- +g[f>>2])*.5;r=4.0-k*k;s=q*q}else{r=2.0-k;s=(k+2.0)*.25}k=+Y(+((o/+P(+(r*.25+s))-j)*.1151292473077774));t=a+(e<<2)|0;g[t>>2]=+g[t>>2]*k;t=e+1|0;if((c[b+(t<<2)>>2]|0)==(n|0)){u=t;while(1){v=a+(u<<2)|0;g[v>>2]=k*+g[v>>2];v=u+1|0;if((c[b+(v<<2)>>2]|0)==(n|0)){u=v}else{w=v;break}}}else{w=t}if((w|0)<(d|0)){e=w}else{break}}i=l;return}while(1){w=c[b+(p<<2)>>2]|0;s=+R(+(m*+(w|0)))*2.0;e=1;r=.5;k=.5;do{k=k*(s- +g[f+(e+ -1<<2)>>2]);r=r*(s- +g[f+(e<<2)>>2]);e=e+2|0;}while((e|0)<(h|0));if((e|0)==(h|0)){q=k*(s- +g[f+(h+ -1<<2)>>2]);x=(4.0-s*s)*r*r;y=q*q}else{x=(2.0-s)*r*r;y=(s+2.0)*k*k}q=+Y(+((o/+P(+(x+y))-j)*.1151292473077774));t=a+(p<<2)|0;g[t>>2]=+g[t>>2]*q;t=p+1|0;if((c[b+(t<<2)>>2]|0)==(w|0)){u=t;while(1){n=a+(u<<2)|0;g[n>>2]=q*+g[n>>2];n=u+1|0;if((c[b+(n<<2)>>2]|0)==(w|0)){u=n}else{z=n;break}}}else{z=t}if((z|0)<(d|0)){p=z}else{break}}i=l;return}function Sd(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;e=i;if((c[b>>2]|0)>1){Db(d,1,1);Db(d,(c[b>>2]|0)+ -1|0,4)}else{Db(d,0,1)}f=b+1156|0;do{if((c[f>>2]|0)>0){Db(d,1,1);Db(d,(c[f>>2]|0)+ -1|0,8);if((c[f>>2]|0)<=0){break}g=b+1160|0;h=a+4|0;j=b+2184|0;k=0;do{l=c[g+(k<<2)>>2]|0;m=c[h>>2]|0;n=(m|0)==0?0:m+ -1|0;if((n|0)==0){o=0}else{m=n;n=0;while(1){p=n+1|0;q=m>>>1;if((q|0)==0){o=p;break}else{n=p;m=q}}}Db(d,l,o);m=c[j+(k<<2)>>2]|0;n=c[h>>2]|0;q=(n|0)==0?0:n+ -1|0;if((q|0)==0){r=0}else{n=q;q=0;while(1){p=q+1|0;s=n>>>1;if((s|0)==0){r=p;break}else{q=p;n=s}}}Db(d,m,r);k=k+1|0;}while((k|0)<(c[f>>2]|0))}else{Db(d,0,1)}}while(0);Db(d,0,2);f=c[b>>2]|0;do{if((f|0)>1){r=a+4|0;if((c[r>>2]|0)<=0){break}o=b+4|0;k=0;do{Db(d,c[o+(k<<2)>>2]|0,4);k=k+1|0;}while((k|0)<(c[r>>2]|0));t=c[b>>2]|0;u=17}else{t=f;u=17}}while(0);do{if((u|0)==17){if((t|0)>0){break}i=e;return}}while(0);t=b+1028|0;u=b+1092|0;f=0;do{Db(d,0,8);Db(d,c[t+(f<<2)>>2]|0,8);Db(d,c[u+(f<<2)>>2]|0,8);f=f+1|0;}while((f|0)<(c[b>>2]|0));i=e;return}function Td(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;d=i;e=_e(1,3208)|0;f=c[a+28>>2]|0;hf(e|0,0,3208)|0;g=Hb(b,1)|0;a:do{if((g|0)<0){h=27}else{if((g|0)==0){c[e>>2]=1}else{j=Hb(b,4)|0;c[e>>2]=j+1;if((j|0)<0){break}}j=Hb(b,1)|0;if((j|0)<0){h=27;break}if((j|0)!=0){j=Hb(b,8)|0;k=e+1156|0;c[k>>2]=j+1;if((j|0)<0){h=27;break}j=a+4|0;l=e+1160|0;m=e+2184|0;n=c[j>>2]|0;o=0;do{p=(n|0)==0?0:n+ -1|0;if((p|0)==0){q=0}else{r=p;p=0;while(1){s=p+1|0;t=r>>>1;if((t|0)==0){q=s;break}else{p=s;r=t}}}r=Hb(b,q)|0;c[l+(o<<2)>>2]=r;p=c[j>>2]|0;t=(p|0)==0?0:p+ -1|0;if((t|0)==0){u=0}else{p=t;t=0;while(1){s=t+1|0;v=p>>>1;if((v|0)==0){u=s;break}else{t=s;p=v}}}p=Hb(b,u)|0;c[m+(o<<2)>>2]=p;if((p|r|0)<0|(r|0)==(p|0)){h=27;break a}n=c[j>>2]|0;o=o+1|0;if(!((r|0)<(n|0)&(p|0)<(n|0))){h=27;break a}}while((o|0)<(c[k>>2]|0))}if((Hb(b,2)|0)!=0){h=27;break}k=c[e>>2]|0;do{if((k|0)>1){o=a+4|0;if((c[o>>2]|0)<=0){break}n=e+4|0;j=0;while(1){m=Hb(b,4)|0;c[n+(j<<2)>>2]=m;l=c[e>>2]|0;p=j+1|0;if((m|0)>=(l|0)|(m|0)<0){break a}if((p|0)<(c[o>>2]|0)){j=p}else{w=l;h=20;break}}}else{w=k;h=20}}while(0);do{if((h|0)==20){if((w|0)>0){break}else{x=e}i=d;return x|0}}while(0);k=e+1028|0;j=f+16|0;o=e+1092|0;n=f+20|0;r=0;while(1){Hb(b,8)|0;l=Hb(b,8)|0;c[k+(r<<2)>>2]=l;if((l|0)>=(c[j>>2]|0)|(l|0)<0){h=27;break a}l=Hb(b,8)|0;c[o+(r<<2)>>2]=l;p=r+1|0;if((l|0)>=(c[n>>2]|0)|(l|0)<0){h=27;break a}if((p|0)<(c[e>>2]|0)){r=p}else{x=e;break}}i=d;return x|0}}while(0);do{if((h|0)==27){if((e|0)==0){x=0}else{break}i=d;return x|0}}while(0);Ze(e);x=0;i=d;return x|0}function Ud(a){a=a|0;var b=0;b=i;if((a|0)!=0){Ze(a)}i=b;return}function Vd(a){a=a|0;var b=0,d=0,e=0,f=0,h=0,j=0,l=0,m=0,n=0,o=0,p=0,q=0.0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0.0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0.0,I=0,J=0,K=0,L=0.0,M=0.0,N=0,O=0.0,P=0,Q=0.0,R=0.0,S=0.0,T=0.0,U=0.0,V=0,W=0,X=0.0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0;b=i;d=c[a+64>>2]|0;e=c[d+4>>2]|0;f=c[e+28>>2]|0;h=c[d+104>>2]|0;d=c[a+104>>2]|0;j=c[a+36>>2]|0;l=e+4|0;e=c[l>>2]<<2;m=i;i=i+((1*e|0)+7&-8)|0;n=m;m=ec(a,e)|0;e=ec(a,c[l>>2]<<2)|0;o=ec(a,c[l>>2]<<2)|0;p=d+4|0;q=+g[p>>2];r=i;i=i+((1*(c[l>>2]<<2)|0)+7&-8)|0;s=r;r=a+28|0;t=c[r>>2]|0;u=c[f+544+(t<<2)>>2]|0;v=(c[h+56>>2]|0)+((((t|0)!=0?2:0)+(c[d+8>>2]|0)|0)*52|0)|0;w=a+40|0;c[w>>2]=t;if((c[l>>2]|0)>0){x=(j|0)/2|0;y=x<<2;z=+(((g[k>>2]=4.0/+(j|0),c[k>>2]|0)&2147483647)>>>0)*7.177114298428933e-7+-764.6162109375+.345;A=h+4|0;B=a+24|0;C=a+32|0;D=h+12|0;E=h+20|0;F=j+ -1|0;G=(F|0)>1;H=q;I=0;while(1){J=c[(c[a>>2]|0)+(I<<2)>>2]|0;c[e+(I<<2)>>2]=ec(a,y)|0;K=m+(I<<2)|0;c[K>>2]=ec(a,y)|0;od(J,A,f,c[B>>2]|0,c[r>>2]|0,c[C>>2]|0);xc(c[c[D+(c[r>>2]<<2)>>2]>>2]|0,J,c[K>>2]|0);gd(E+((c[r>>2]|0)*12|0)|0,J);L=z+(+(((g[k>>2]=+g[J>>2],c[k>>2]|0)&2147483647)>>>0)*7.177114298428933e-7+-764.6162109375)+.345;g[J>>2]=L;K=s+(I<<2)|0;g[K>>2]=L;if(G){M=L;N=1;while(1){O=+g[J+(N<<2)>>2];P=N+1|0;Q=+g[J+(P<<2)>>2];R=z+(+(((g[k>>2]=O*O+Q*Q,c[k>>2]|0)&2147483647)>>>0)*3.5885571492144663e-7+-382.30810546875)+.345;g[J+(P>>1<<2)>>2]=R;if(R>M){g[K>>2]=R;S=R}else{S=M}P=N+2|0;if((P|0)<(F|0)){M=S;N=P}else{T=S;break}}}else{T=L}if(T>0.0){g[K>>2]=0.0;U=0.0}else{U=T}M=U>H?U:H;N=I+1|0;if((N|0)<(c[l>>2]|0)){H=M;I=N}else{V=x;W=y;X=M;break}}}else{y=(j|0)/2|0;V=y;W=y<<2;X=q}y=ec(a,W)|0;x=ec(a,W)|0;W=c[l>>2]|0;I=u+4|0;a:do{if((W|0)>0){F=u+1028|0;G=f+800|0;E=h+48|0;if((j|0)>1){Y=0}else{D=0;while(1){C=c[I+(D<<2)>>2]|0;B=c[m+(D<<2)>>2]|0;A=c[(c[a>>2]|0)+(D<<2)>>2]|0;N=A+(V<<2)|0;c[w>>2]=t;J=ec(a,60)|0;P=o+(D<<2)|0;c[P>>2]=J;Z=J+0|0;_=Z+60|0;do{c[Z>>2]=0;Z=Z+4|0}while((Z|0)<(_|0));Dc(v,N,y);Fc(v,A,x,X,+g[s+(D<<2)>>2]);Gc(v,y,x,1,A,B,N);J=F+(C<<2)|0;$=c[J>>2]|0;if((c[G+($<<2)>>2]|0)!=1){aa=-1;break}ba=Fd(a,c[(c[E>>2]|0)+($<<2)>>2]|0,N,A)|0;c[(c[P>>2]|0)+28>>2]=ba;do{if((qd(a)|0)!=0){if((c[(c[P>>2]|0)+28>>2]|0)==0){break}Gc(v,y,x,2,A,B,N);ba=Fd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,N,A)|0;c[(c[P>>2]|0)+56>>2]=ba;Gc(v,y,x,0,A,B,N);ba=Fd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,N,A)|0;c[c[P>>2]>>2]=ba;ba=c[P>>2]|0;$=Hd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,c[ba>>2]|0,c[ba+28>>2]|0,9362)|0;c[(c[P>>2]|0)+4>>2]=$;$=c[P>>2]|0;ba=Hd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,c[$>>2]|0,c[$+28>>2]|0,18724)|0;c[(c[P>>2]|0)+8>>2]=ba;ba=c[P>>2]|0;$=Hd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,c[ba>>2]|0,c[ba+28>>2]|0,28086)|0;c[(c[P>>2]|0)+12>>2]=$;$=c[P>>2]|0;ba=Hd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,c[$>>2]|0,c[$+28>>2]|0,37449)|0;c[(c[P>>2]|0)+16>>2]=ba;ba=c[P>>2]|0;$=Hd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,c[ba>>2]|0,c[ba+28>>2]|0,46811)|0;c[(c[P>>2]|0)+20>>2]=$;$=c[P>>2]|0;ba=Hd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,c[$>>2]|0,c[$+28>>2]|0,56173)|0;c[(c[P>>2]|0)+24>>2]=ba;ba=c[P>>2]|0;$=Hd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,c[ba+28>>2]|0,c[ba+56>>2]|0,9362)|0;c[(c[P>>2]|0)+32>>2]=$;$=c[P>>2]|0;ba=Hd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,c[$+28>>2]|0,c[$+56>>2]|0,18724)|0;c[(c[P>>2]|0)+36>>2]=ba;ba=c[P>>2]|0;$=Hd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,c[ba+28>>2]|0,c[ba+56>>2]|0,28086)|0;c[(c[P>>2]|0)+40>>2]=$;$=c[P>>2]|0;ba=Hd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,c[$+28>>2]|0,c[$+56>>2]|0,37449)|0;c[(c[P>>2]|0)+44>>2]=ba;ba=c[P>>2]|0;$=Hd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,c[ba+28>>2]|0,c[ba+56>>2]|0,46811)|0;c[(c[P>>2]|0)+48>>2]=$;$=c[P>>2]|0;ba=Hd(a,c[(c[E>>2]|0)+(c[J>>2]<<2)>>2]|0,c[$+28>>2]|0,c[$+56>>2]|0,56173)|0;c[(c[P>>2]|0)+52>>2]=ba}}while(0);P=D+1|0;J=c[l>>2]|0;if((P|0)<(J|0)){D=P}else{ca=J;da=F;ea=E;break a}}i=b;return aa|0}while(1){D=c[I+(Y<<2)>>2]|0;K=c[m+(Y<<2)>>2]|0;J=c[(c[a>>2]|0)+(Y<<2)>>2]|0;P=J+(V<<2)|0;c[w>>2]=t;A=ec(a,60)|0;N=o+(Y<<2)|0;c[N>>2]=A;Z=A+0|0;_=Z+60|0;do{c[Z>>2]=0;Z=Z+4|0}while((Z|0)<(_|0));A=0;do{g[J+(A+V<<2)>>2]=+(((g[k>>2]=+g[K+(A<<2)>>2],c[k>>2]|0)&2147483647)>>>0)*7.177114298428933e-7+-764.6162109375+.345;A=A+1|0;}while((A|0)<(V|0));Dc(v,P,y);Fc(v,J,x,X,+g[s+(Y<<2)>>2]);Gc(v,y,x,1,J,K,P);A=F+(D<<2)|0;B=c[A>>2]|0;if((c[G+(B<<2)>>2]|0)!=1){aa=-1;break}C=Fd(a,c[(c[E>>2]|0)+(B<<2)>>2]|0,P,J)|0;c[(c[N>>2]|0)+28>>2]=C;do{if((qd(a)|0)!=0){if((c[(c[N>>2]|0)+28>>2]|0)==0){break}Gc(v,y,x,2,J,K,P);C=Fd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,P,J)|0;c[(c[N>>2]|0)+56>>2]=C;Gc(v,y,x,0,J,K,P);C=Fd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,P,J)|0;c[c[N>>2]>>2]=C;C=c[N>>2]|0;B=Hd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,c[C>>2]|0,c[C+28>>2]|0,9362)|0;c[(c[N>>2]|0)+4>>2]=B;B=c[N>>2]|0;C=Hd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,c[B>>2]|0,c[B+28>>2]|0,18724)|0;c[(c[N>>2]|0)+8>>2]=C;C=c[N>>2]|0;B=Hd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,c[C>>2]|0,c[C+28>>2]|0,28086)|0;c[(c[N>>2]|0)+12>>2]=B;B=c[N>>2]|0;C=Hd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,c[B>>2]|0,c[B+28>>2]|0,37449)|0;c[(c[N>>2]|0)+16>>2]=C;C=c[N>>2]|0;B=Hd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,c[C>>2]|0,c[C+28>>2]|0,46811)|0;c[(c[N>>2]|0)+20>>2]=B;B=c[N>>2]|0;C=Hd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,c[B>>2]|0,c[B+28>>2]|0,56173)|0;c[(c[N>>2]|0)+24>>2]=C;C=c[N>>2]|0;B=Hd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,c[C+28>>2]|0,c[C+56>>2]|0,9362)|0;c[(c[N>>2]|0)+32>>2]=B;B=c[N>>2]|0;C=Hd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,c[B+28>>2]|0,c[B+56>>2]|0,18724)|0;c[(c[N>>2]|0)+36>>2]=C;C=c[N>>2]|0;B=Hd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,c[C+28>>2]|0,c[C+56>>2]|0,28086)|0;c[(c[N>>2]|0)+40>>2]=B;B=c[N>>2]|0;C=Hd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,c[B+28>>2]|0,c[B+56>>2]|0,37449)|0;c[(c[N>>2]|0)+44>>2]=C;C=c[N>>2]|0;B=Hd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,c[C+28>>2]|0,c[C+56>>2]|0,46811)|0;c[(c[N>>2]|0)+48>>2]=B;B=c[N>>2]|0;C=Hd(a,c[(c[E>>2]|0)+(c[A>>2]<<2)>>2]|0,c[B+28>>2]|0,c[B+56>>2]|0,56173)|0;c[(c[N>>2]|0)+52>>2]=C}}while(0);N=Y+1|0;A=c[l>>2]|0;if((N|0)<(A|0)){Y=N}else{ca=A;da=F;ea=E;break a}}i=b;return aa|0}else{ca=W;da=u+1028|0;ea=h+48|0}}while(0);g[p>>2]=X;p=ca<<2;ca=i;i=i+((1*p|0)+7&-8)|0;W=ca;ca=i;i=i+((1*p|0)+7&-8)|0;p=ca;ca=(qd(a)|0)!=0;Y=d+12|0;d=h+44|0;x=a+24|0;y=a+32|0;s=f+2868|0;V=f+3240|0;Z=u+1092|0;_=f+1312|0;f=h+52|0;h=ca?0:7;while(1){ca=c[Y+(h<<2)>>2]|0;Db(ca,0,1);Db(ca,t,c[d>>2]|0);if((c[r>>2]|0)!=0){Db(ca,c[x>>2]|0,1);Db(ca,c[y>>2]|0,1)}w=c[l>>2]|0;if((w|0)>0){j=0;while(1){c[n+(j<<2)>>2]=Id(ca,a,c[(c[ea>>2]|0)+(c[da+(c[I+(j<<2)>>2]<<2)>>2]<<2)>>2]|0,c[(c[o+(j<<2)>>2]|0)+(h<<2)>>2]|0,c[e+(j<<2)>>2]|0)|0;E=j+1|0;F=c[l>>2]|0;if((E|0)<(F|0)){j=E}else{fa=F;break}}}else{fa=w}Hc(h,s,v,u,m,e,n,c[V+((c[r>>2]|0)*60|0)+(h<<2)>>2]|0,fa);if((c[u>>2]|0)>0){j=0;do{F=c[Z+(j<<2)>>2]|0;E=c[l>>2]|0;if((E|0)>0){G=E;E=0;A=0;while(1){if((c[I+(A<<2)>>2]|0)==(j|0)){c[p+(E<<2)>>2]=(c[n+(A<<2)>>2]|0)!=0;c[W+(E<<2)>>2]=c[e+(A<<2)>>2];ga=c[l>>2]|0;ha=E+1|0}else{ga=G;ha=E}N=A+1|0;if((N|0)<(ga|0)){G=ga;E=ha;A=N}else{ia=ha;break}}}else{ia=0}A=_+(F<<2)|0;E=kb[c[(c[28056+(c[A>>2]<<2)>>2]|0)+20>>2]&7](a,c[(c[f>>2]|0)+(F<<2)>>2]|0,W,p,ia)|0;G=c[l>>2]|0;if((G|0)>0){N=0;J=0;while(1){if((c[I+(J<<2)>>2]|0)==(j|0)){c[W+(N<<2)>>2]=c[e+(J<<2)>>2];ja=N+1|0}else{ja=N}P=J+1|0;if((P|0)<(G|0)){N=ja;J=P}else{ka=ja;break}}}else{ka=0}ib[c[(c[28056+(c[A>>2]<<2)>>2]|0)+24>>2]&3](ca,a,c[(c[f>>2]|0)+(F<<2)>>2]|0,W,p,ka,E,j)|0;j=j+1|0;}while((j|0)<(c[u>>2]|0))}j=(qd(a)|0)!=0;if((h|0)<((j?14:7)|0)){h=h+1|0}else{aa=0;break}}i=b;return aa|0}function Wd(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0.0,G=0.0,H=0;d=i;e=c[a+64>>2]|0;f=c[e+4>>2]|0;h=c[f+28>>2]|0;j=c[e+104>>2]|0;e=a+28|0;k=c[h+(c[e>>2]<<2)>>2]|0;c[a+36>>2]=k;l=f+4|0;f=c[l>>2]<<2;m=i;i=i+((1*f|0)+7&-8)|0;n=m;m=i;i=i+((1*f|0)+7&-8)|0;o=m;m=i;i=i+((1*f|0)+7&-8)|0;p=m;m=i;i=i+((1*f|0)+7&-8)|0;f=m;m=c[l>>2]|0;if((m|0)>0){q=b+4|0;r=b+1028|0;s=h+800|0;t=j+48|0;u=k<<1&2147483646;v=0;while(1){w=c[r+(c[q+(v<<2)>>2]<<2)>>2]|0;x=jb[c[(c[28048+(c[s+(w<<2)>>2]<<2)>>2]|0)+20>>2]&15](a,c[(c[t>>2]|0)+(w<<2)>>2]|0)|0;c[f+(v<<2)>>2]=x;c[p+(v<<2)>>2]=(x|0)!=0;hf(c[(c[a>>2]|0)+(v<<2)>>2]|0,0,u|0)|0;x=v+1|0;w=c[l>>2]|0;if((x|0)<(w|0)){v=x}else{y=w;break}}}else{y=m}m=b+1156|0;v=c[m>>2]|0;if((v|0)>0){u=b+1160|0;t=b+2184|0;s=0;do{q=p+(c[u+(s<<2)>>2]<<2)|0;r=c[t+(s<<2)>>2]|0;if((c[q>>2]|0)==0){if((c[p+(r<<2)>>2]|0)!=0){z=10}}else{z=10}if((z|0)==10){z=0;c[q>>2]=1;c[p+(r<<2)>>2]=1}s=s+1|0;}while((s|0)<(v|0))}if((c[b>>2]|0)>0){s=b+1092|0;z=h+1312|0;t=j+52|0;u=b+4|0;r=y;y=0;while(1){if((r|0)>0){q=r;w=0;x=0;while(1){if((c[u+(x<<2)>>2]|0)==(y|0)){c[o+(w<<2)>>2]=(c[p+(x<<2)>>2]|0)!=0;c[n+(w<<2)>>2]=c[(c[a>>2]|0)+(x<<2)>>2];A=c[l>>2]|0;B=w+1|0}else{A=q;B=w}C=x+1|0;if((C|0)<(A|0)){q=A;w=B;x=C}else{D=B;break}}}else{D=0}x=c[s+(y<<2)>>2]|0;kb[c[(c[28056+(c[z+(x<<2)>>2]<<2)>>2]|0)+28>>2]&7](a,c[(c[t>>2]|0)+(x<<2)>>2]|0,n,o,D)|0;x=y+1|0;if((x|0)>=(c[b>>2]|0)){break}r=c[l>>2]|0;y=x}E=c[m>>2]|0}else{E=v}if((E|0)>0){v=b+1160|0;m=c[a>>2]|0;y=b+2184|0;r=(k|0)/2|0;D=(k|0)>1;k=E;do{k=k+ -1|0;E=c[m+(c[v+(k<<2)>>2]<<2)>>2]|0;o=c[m+(c[y+(k<<2)>>2]<<2)>>2]|0;if(D){n=0;do{t=E+(n<<2)|0;F=+g[t>>2];z=o+(n<<2)|0;G=+g[z>>2];s=G>0.0;do{if(F>0.0){if(s){g[t>>2]=F;g[z>>2]=F-G;break}else{g[z>>2]=F;g[t>>2]=F+G;break}}else{if(s){g[t>>2]=F;g[z>>2]=F+G;break}else{g[z>>2]=F;g[t>>2]=F-G;break}}}while(0);n=n+1|0;}while((n|0)<(r|0))}}while((k|0)>0)}if((c[l>>2]|0)<=0){i=d;return 0}k=b+4|0;r=b+1028|0;b=h+800|0;h=j+48|0;D=0;do{y=c[r+(c[k+(D<<2)>>2]<<2)>>2]|0;db[c[(c[28048+(c[b+(y<<2)>>2]<<2)>>2]|0)+24>>2]&7](a,c[(c[h>>2]|0)+(y<<2)>>2]|0,c[f+(D<<2)>>2]|0,c[(c[a>>2]|0)+(D<<2)>>2]|0)|0;D=D+1|0;H=c[l>>2]|0;}while((D|0)<(H|0));if((H|0)<=0){i=d;return 0}H=j+12|0;j=0;do{D=c[(c[a>>2]|0)+(j<<2)>>2]|0;uc(c[c[H+(c[e>>2]<<2)>>2]>>2]|0,D,D);j=j+1|0;}while((j|0)<(c[l>>2]|0));i=d;return 0}function Xd(b,e,f,g){b=b|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;h=i;i=i+32|0;j=h;k=j;l=h+8|0;if((g|0)==0){m=-20;i=h;return m|0}if((b|0)==0){m=-1;i=h;return m|0}Re(l,c[g>>2]|0,c[g+4>>2]|0);n=Se(l,8)|0;do{if((n&128|0)==0){if((c[b+4>>2]|0)==0){break}if((c[e+12>>2]|0)==0){break}if((c[f>>2]|0)==0){break}else{m=0}i=h;return m|0}}while(0);a[j]=Se(l,8)|0;a[k+1|0]=Se(l,8)|0;a[k+2|0]=Se(l,8)|0;a[k+3|0]=Se(l,8)|0;a[k+4|0]=Se(l,8)|0;a[k+5|0]=Se(l,8)|0;if((df(k,61976,6)|0)!=0){m=-21;i=h;return m|0}if((n|0)==129){if((e|0)==0){m=-1;i=h;return m|0}if((c[b+4>>2]|0)==0){m=-20;i=h;return m|0}k=e+12|0;if((c[k>>2]|0)!=0){m=-20;i=h;return m|0}j=Se(l,8)|0;o=Se(l,8)|0;p=Se(l,8)|0;q=o<<8|j|p<<16|(Se(l,8)|0)<<24;a:do{if((q|0)<0){r=-20}else{if((q|0)>(Ue(l)|0)){r=-20;break}p=Ye(q+1|0)|0;c[k>>2]=p;if((p|0)==0){r=-1;break}if((q|0)==0){s=p}else{j=q;o=p;while(1){p=j+ -1|0;a[o]=Se(l,8)|0;if((p|0)==0){break}else{o=o+1|0;j=p}}s=c[k>>2]|0}a[s+q|0]=0;j=Se(l,8)|0;o=Se(l,8)|0;p=Se(l,8)|0;t=o<<8|j|p<<16|(Se(l,8)|0)<<24;p=e+8|0;c[p>>2]=t;do{if(!(t>>>0>536870911)){if((t<<2|0)>(Ue(l)|0)){break}j=c[p>>2]|0;o=j<<2;u=Ye(o)|0;v=e+4|0;c[v>>2]=u;w=Ye(o)|0;c[e>>2]=w;if((u|0)==0|(w|0)==0){c[p>>2]=0;r=-1;break a}b:do{if((j|0)>0){w=0;while(1){u=Se(l,8)|0;o=Se(l,8)|0;x=Se(l,8)|0;y=o<<8|u|x<<16|(Se(l,8)|0)<<24;if((y|0)<0){z=40;break}if((y|0)>(Ue(l)|0)){z=40;break}c[(c[v>>2]|0)+(w<<2)>>2]=y;x=Ye(y+1|0)|0;c[(c[e>>2]|0)+(w<<2)>>2]=x;x=c[(c[e>>2]|0)+(w<<2)>>2]|0;if((x|0)==0){z=42;break}if((y|0)==0){A=x}else{u=y;o=x;while(1){x=u+ -1|0;a[o]=Se(l,8)|0;if((x|0)==0){break}else{o=o+1|0;u=x}}A=c[(c[e>>2]|0)+(w<<2)>>2]|0}a[A+y|0]=0;u=w+1|0;if((u|0)<(c[p>>2]|0)){w=u}else{break b}}if((z|0)==40){c[p>>2]=w;r=-20;break a}else if((z|0)==42){c[p>>2]=w;r=-1;break a}}}while(0);v=(Ue(l)|0)>>31&-20;if((v|0)<0){r=v;break a}else{m=2}i=h;return m|0}}while(0);c[p>>2]=0;r=-20}}while(0);ve(e);m=r;i=h;return m|0}else if((n|0)==130){if((e|0)==0|(f|0)==0){m=-1;i=h;return m|0}if((c[b+4>>2]|0)==0){m=-20;i=h;return m|0}if((c[e+12>>2]|0)==0){m=-20;i=h;return m|0}if((c[f>>2]|0)!=0){m=-20;i=h;return m|0}e=_e(1,712)|0;if((e|0)==0){m=-1;i=h;return m|0}r=e+320|0;z=ee(l,r)|0;do{if((z|0)<0){B=z}else{A=le(l,e)|0;if((A|0)<0){B=A;break}c[f>>2]=e;m=1;i=h;return m|0}}while(0);fe(r);pe(e);Ze(e);m=B;i=h;return m|0}else if((n|0)==128){if((c[g+8>>2]|0)==0){m=-20;i=h;return m|0}g=b+4|0;if((c[g>>2]|0)!=0){m=-20;i=h;return m|0}a[b]=Se(l,8)|0;n=b+1|0;a[n]=Se(l,8)|0;a[b+2|0]=Se(l,8)|0;B=a[b]|0;do{if((B&255)>3){C=-22}else{if(B<<24>>24==3){if((d[n]|0)>2){C=-22;break}}c[g>>2]=(Se(l,16)|0)<<4;e=b+8|0;c[e>>2]=(Se(l,16)|0)<<4;r=b+12|0;c[r>>2]=Se(l,24)|0;f=b+16|0;c[f>>2]=Se(l,24)|0;z=b+20|0;c[z>>2]=Se(l,8)|0;A=b+24|0;c[A>>2]=Se(l,8)|0;q=b+28|0;c[q>>2]=Se(l,32)|0;s=Se(l,32)|0;c[b+32>>2]=s;k=c[g>>2]|0;if((k|0)==0){C=-20;break}t=c[e>>2]|0;if((t|0)==0){C=-20;break}if(((c[z>>2]|0)+(c[r>>2]|0)|0)>>>0>k>>>0){C=-20;break}k=c[f>>2]|0;f=c[A>>2]|0;if((f+k|0)>>>0>t>>>0){C=-20;break}if((c[q>>2]|0)==0|(s|0)==0){C=-20;break}c[A>>2]=t-k-f;c[b+36>>2]=Se(l,24)|0;c[b+40>>2]=Se(l,24)|0;c[b+44>>2]=Se(l,8)|0;c[b+52>>2]=Se(l,24)|0;c[b+56>>2]=Se(l,6)|0;c[b+60>>2]=Se(l,5)|0;f=Se(l,2)|0;c[b+48>>2]=f;if((f|0)==1){C=-20;break}if((Se(l,3)|0)!=0){C=-20;break}f=(Ue(l)|0)>>31&-20;if((f|0)<0){C=f;break}else{m=3}i=h;return m|0}}while(0);te(b);m=C;i=h;return m|0}else{m=-20;i=h;return m|0}return 0}function Yd(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0;e=i;f=c[b+2936+(d<<2)>>2]|0;g=c[b+2948+(d<<2)>>2]|0;h=c[a+72+(d<<5)>>2]|0;j=c[a+168>>2]|0;if((f|0)>=(g|0)){k=0;l=b+2840|0;m=d<<2;n=l+m|0;o=n;c[o>>2]=k;p=g-f|0;q=$(p,h)|0;r=q-k|0;s=b+2852|0;t=d<<2;u=s+t|0;v=u;c[v>>2]=r;i=e;return}w=$(h,f)|0;x=(h|0)>0;y=1-h|0;z=~h;A=(c[a+72+(d<<5)+8>>2]|0)+w|0;w=f;a=0;while(1){do{if((w|0)==0){if(x){B=A;C=0;D=a}else{E=A;F=a;break}while(1){G=j+(B<<2)|0;H=c[G>>2]|0;if((H&1|0)==0){I=D}else{J=b+2960+(d<<4)+((H>>>6&3)<<2)|0;K=(c[J>>2]<<16)+H|0;c[G>>2]=K;c[J>>2]=K>>16;I=D+1|0}K=C+1|0;if((K|0)<(h|0)){B=B+1|0;C=K;D=I}else{break}}E=h+A|0;F=I}else{if(!x){E=A;F=a;break}K=A;J=0;G=-1;H=a;L=(c[j+(A-h<<2)>>2]|0)>>>6&3;M=-1;while(1){N=J+1|0;O=(N|0)<(h|0);if(O){P=(c[j+(y+K<<2)>>2]|0)>>>6&3}else{P=-1}Q=j+(K<<2)|0;R=c[Q>>2]|0;if((R&1|0)==0){S=-1;T=H}else{U=R>>>6&3;a:do{switch(((M|0)==(U|0))<<1|(G|0)==(U|0)|((L|0)==(U|0))<<2|((P|0)==(U|0))<<3|0){case 3:case 1:{V=c[j+(K+ -1<<2)>>2]>>16;break};case 8:{V=c[j+(y+K<<2)>>2]>>16;break};case 5:{V=((c[j+(K-h<<2)>>2]>>16)+(c[j+(K+ -1<<2)>>2]>>16)|0)/2|0;break};case 13:case 11:case 9:{V=(((c[j+(y+K<<2)>>2]>>16)*53|0)+((c[j+(K+ -1<<2)>>2]>>16)*75|0)|0)/128|0;break};case 15:case 7:{W=K+ -1|0;X=c[j+(W<<2)>>2]>>16;Y=c[j+(W-h<<2)>>2]>>16;W=c[j+(K-h<<2)>>2]>>16;Z=(((W+X|0)*29|0)+($(Y,-26)|0)|0)/32|0;_=Z-W|0;if((((_|0)>-1?_:0-_|0)|0)>128){V=W;break a}W=Z-X|0;if((((W|0)>-1?W:0-W|0)|0)>128){V=X;break a}X=Z-Y|0;V=(((X|0)>-1?X:0-X|0)|0)>128?Y:Z;break};case 12:case 6:case 4:{V=c[j+(K-h<<2)>>2]>>16;break};case 2:{V=c[j+(K+z<<2)>>2]>>16;break};case 14:{V=((((c[j+(y+K<<2)>>2]>>16)+(c[j+(K+z<<2)>>2]>>16)|0)*3|0)+((c[j+(K-h<<2)>>2]>>16)*10|0)|0)/16|0;break};case 10:{V=((c[j+(y+K<<2)>>2]>>16)+(c[j+(K+z<<2)>>2]>>16)|0)/2|0;break};default:{V=c[b+2960+(d<<4)+(U<<2)>>2]|0}}}while(0);Z=R+(V<<16)|0;c[Q>>2]=Z;c[b+2960+(d<<4)+(U<<2)>>2]=Z>>16;S=U;T=H+1|0}if(O){Z=L;K=K+1|0;G=S;H=T;L=P;M=Z;J=N}else{break}}E=h+A|0;F=T}}while(0);J=w+1|0;if((J|0)<(g|0)){A=E;w=J;a=F}else{k=F;break}}l=b+2840|0;m=d<<2;n=l+m|0;o=n;c[o>>2]=k;p=g-f|0;q=$(p,h)|0;r=q-k|0;s=b+2852|0;t=d<<2;u=s+t|0;v=u;c[v>>2]=r;i=e;return}function Zd(b,d){b=b|0;d=d|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;f=i;if((b|0)==0|(d|0)==0){g=0;i=f;return g|0}h=xe(57136,16)|0;do{if((h|0)!=0){if((Fe(h,b,3)|0)<0){break}j=h+51656|0;if((ne(j,d)|0)<0){Ge(h);break}k=Ye((c[h+180>>2]|0)*129|0)|0;c[h+53512>>2]=k;if((k|0)==0){pe(j);Ge(h);break}else{l=0}do{c[h+880+(l*24|0)>>2]=h+2416+(l*768|0);c[h+880+(l*24|0)+4>>2]=h+2416+(l*768|0)+128;c[h+880+(l*24|0)+8>>2]=h+2416+(l*768|0)+256;c[h+880+(l*24|0)+12>>2]=h+2416+(l*768|0)+384;c[h+880+(l*24|0)+16>>2]=h+2416+(l*768|0)+512;c[h+880+(l*24|0)+20>>2]=h+2416+(l*768|0)+640;l=l+1|0;}while((l|0)<64);Ae(h+880|0,h+53528|0,d+320|0);j=0;do{k=c[h+880+(j*24|0)>>2]|0;m=c[h+880+(j*24|0)+8>>2]|0;n=c[h+880+(j*24|0)+16>>2]|0;o=c[h+880+(j*24|0)+4>>2]|0;p=c[h+880+(j*24|0)+12>>2]|0;q=c[h+880+(j*24|0)+20>>2]|0;c[h+53784+(j<<2)>>2]=0-((e[m+34>>1]|0)+(e[m+24>>1]|0)+(e[m+36>>1]|0)+(e[m+48>>1]|0)+(e[n+24>>1]|0)+(e[n+34>>1]|0)+(e[n+36>>1]|0)+(e[n+48>>1]|0)+(e[p+24>>1]|0)+(e[p+34>>1]|0)+(e[p+36>>1]|0)+(e[p+48>>1]|0)+(e[q+24>>1]|0)+(e[q+34>>1]|0)+(e[q+36>>1]|0)+(e[q+48>>1]|0)+((e[k+34>>1]|0)+(e[k+24>>1]|0)+(e[k+36>>1]|0)+(e[k+48>>1]|0)+(e[o+24>>1]|0)+(e[o+34>>1]|0)+(e[o+36>>1]|0)+(e[o+48>>1]|0)<<1)>>11);j=j+1|0;}while((j|0)<64);j=h+51568|0;o=d+576|0;k=j+64|0;do{a[j]=a[o]|0;j=j+1|0;o=o+1|0}while((j|0)<(k|0));c[h+53524>>2]=0;c[h+54040>>2]=0;c[h+54044>>2]=0;c[h+54048>>2]=0;c[h+54104>>2]=0;c[h+54108>>2]=0;o=h+856|0;c[o>>2]=0;c[o+4>>2]=0;g=h;i=f;return g|0}}while(0);ye(h);g=0;i=f;return g|0}function _d(a){a=a|0;var b=0;b=i;if((a|0)==0){i=b;return}Ze(c[a+54048>>2]|0);Ze(c[a+54044>>2]|0);Ze(c[a+54040>>2]|0);Ze(c[a+53512>>2]|0);pe(a+51656|0);Ge(a);ye(a);i=b;return}
function $d(f,g,h){f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0,Pa=0,Qa=0,Ra=0,Sa=0,Ta=0,Ua=0,Va=0,Wa=0,Xa=0,Ya=0,Za=0,_a=0,$a=0,ab=0,bb=0,cb=0,db=0,eb=0,gb=0,hb=0,ib=0,jb=0,kb=0,mb=0,nb=0,ob=0,pb=0,qb=0,rb=0,sb=0,tb=0,ub=0,vb=0,wb=0,xb=0,yb=0,zb=0,Ab=0,Bb=0,Cb=0,Db=0,Eb=0,Fb=0,Gb=0,Hb=0,Ib=0,Jb=0,Kb=0,Lb=0,Mb=0,Nb=0,Ob=0,Pb=0,Qb=0,Rb=0,Sb=0,Tb=0,Ub=0,Vb=0,Wb=0,Xb=0,Yb=0,Zb=0,_b=0,$b=0,ac=0,bc=0,cc=0,dc=0,ec=0,fc=0,gc=0,hc=0,ic=0,jc=0,kc=0,lc=0,mc=0,nc=0,oc=0,pc=0,qc=0,rc=0,sc=0,tc=0,uc=0,vc=0,wc=0,xc=0,yc=0,zc=0,Ac=0,Bc=0,Cc=0,Dc=0,Ec=0,Fc=0,Gc=0,Hc=0,Ic=0,Jc=0,Kc=0,Lc=0,Mc=0,Nc=0,Oc=0,Pc=0,Qc=0,Rc=0,Sc=0,Tc=0,Uc=0,Vc=0,Wc=0,Xc=0,Yc=0,Zc=0,_c=0,$c=0,ad=0,bd=0,cd=0,dd=0,ed=0,fd=0,gd=0;j=i;i=i+1112|0;k=j;l=k;m=j+8|0;n=m;o=j+264|0;p=j+1032|0;q=p;r=j+1040|0;s=j+1048|0;t=s;u=j+1056|0;v=u;w=j+1064|0;if((f|0)==0|(g|0)==0){x=-1;i=j;return x|0}y=c[g+4>>2]|0;a:do{if((y|0)==0){a[f+872|0]=1;c[f+232>>2]=0;z=0}else{A=f+51636|0;Re(A,c[g>>2]|0,y);if((Te(A)|0)!=0){x=-24;i=j;return x|0}B=f+872|0;a[B]=Te(A)|0;a[f+875|0]=Se(A,6)|0;do{if((Te(A)|0)==0){a[f+874|0]=1}else{a[f+876|0]=Se(A,6)|0;if((Te(A)|0)==0){a[f+874|0]=2;break}else{a[f+877|0]=Se(A,6)|0;a[f+874|0]=3;break}}}while(0);do{if((a[B]|0)==0){if((Se(A,3)|0)!=0){x=-23;i=j;return x|0}if((a[B]|0)!=0){break}C=c[f+216>>2]|0;E=c[f+184>>2]|0;F=c[f+188>>2]|0;G=c[f+168>>2]|0;H=0;I=0;J=0;K=0;while(1){L=(c[f+72+(I<<5)+28>>2]|0)+H|0;if(K>>>0<L>>>0){M=J;N=K;while(1){O=F+N|0;P=M;Q=0;while(1){do{if(((d[O]|0)>>>2&15&1<<Q|0)==0){R=P}else{S=c[E+(N<<6)+(Q<<4)>>2]|0;if((S|0)>-1){T=G+(S<<2)|0;c[T>>2]=c[T>>2]&-1986|385;c[C+(P<<2)>>2]=S;U=P+1|0}else{U=P}S=c[E+(N<<6)+(Q<<4)+4>>2]|0;if((S|0)>-1){T=G+(S<<2)|0;c[T>>2]=c[T>>2]&-1986|385;c[C+(U<<2)>>2]=S;V=U+1|0}else{V=U}S=c[E+(N<<6)+(Q<<4)+8>>2]|0;if((S|0)>-1){T=G+(S<<2)|0;c[T>>2]=c[T>>2]&-1986|385;c[C+(V<<2)>>2]=S;W=V+1|0}else{W=V}S=c[E+(N<<6)+(Q<<4)+12>>2]|0;if(!((S|0)>-1)){R=W;break}T=G+(S<<2)|0;c[T>>2]=c[T>>2]&-1986|385;c[C+(W<<2)>>2]=S;R=W+1|0}}while(0);S=Q+1|0;if((S|0)<4){P=R;Q=S}else{break}}Q=N+1|0;if(Q>>>0<L>>>0){M=R;N=Q}else{X=R;Y=L;break}}}else{X=J;Y=K}c[f+220+(I<<2)>>2]=X-J;N=I+1|0;if((N|0)<3){I=N;J=X;K=Y;H=L}else{break}}c[f+232>>2]=X;z=X;break a}}while(0);B=Te(A)|0;H=f+188|0;K=c[H>>2]|0;J=f+192|0;I=c[J>>2]|0;do{if((I|0)==0){Z=0}else{C=B;G=0;E=0;while(1){F=qe(A,62392)|0;if((F|0)>15){N=F&31;_=N+6+(Se(A,F-N>>4)|0)|0}else{_=F}F=(C&255)<<1&2;N=0-_|0;M=E+1|0;Q=E-(I>>>0>M>>>0?I:M)|0;M=Q>>>0<N>>>0;P=_;O=E;do{S=K+O|0;a[S]=a[S]&-4|F;O=O+1|0;P=P+ -1|0;aa=O>>>0<I>>>0;}while((P|0)!=0&aa);P=M?N:Q;ba=$(P,C)|0;O=E-P|0;ca=G-ba|0;if(_>>>0>4128&aa){da=Te(A)|0}else{da=(C|0)==0|0}if(O>>>0<I>>>0){C=da;G=ca;E=O}else{break}}E=c[J>>2]|0;b:do{if(ca>>>0<E>>>0){C=c[H>>2]|0;O=0;while(1){if((a[C+O|0]&2)==0){break}else{O=O+1|0}}Q=Te(A)|0;N=O;while(1){M=qe(A,62392)|0;if((M|0)>15){P=M&31;ea=P+6+(Se(A,M-P>>4)|0)|0}else{ea=M}if(!(N>>>0<E>>>0)){break b}M=Q&1;P=ea;F=N;while(1){L=C+F|0;S=a[L]|0;if((S&2)==0){if((P|0)==0){break}a[L]=S&-2|M;fa=P+ -1|0}else{fa=P}S=F+1|0;if(S>>>0<E>>>0){P=fa;F=S}else{break b}}if(ea>>>0<4129){Q=(Q|0)==0|0;N=F;continue}else{Q=Te(A)|0;N=F;continue}}}}while(0);if((G|0)==(ba|0)){Z=0;break}Z=(Te(A)|0)==0|0}}while(0);J=c[f+184>>2]|0;I=c[H>>2]|0;K=c[f+200>>2]|0;B=c[f+168>>2]|0;E=c[f+216>>2]|0;N=c[f+180>>2]|0;Q=Z;C=0;O=0;P=0;M=0;S=0;L=0;while(1){T=(c[f+72+(M<<5)+28>>2]|0)+O|0;if(L>>>0<T>>>0){ga=(M|0)==0;ha=Q;ia=C;ja=P;ka=S;la=L;while(1){ma=I+la|0;na=la<<2;if(ga){oa=ha;pa=ia;qa=ja;ra=0;sa=ka;while(1){if(((d[ma]|0)>>>2&15&1<<ra|0)==0){ta=oa;ua=pa;va=qa;wa=sa}else{xa=0;ya=oa;za=pa;Aa=qa;Ba=0;Ca=sa;while(1){Da=c[J+(la<<6)+(ra<<4)+(xa<<2)>>2]|0;if((Da|0)>-1){Ea=a[ma]|0;do{if((Ea&1)==0){if((Ea&2)==0){Fa=ya;Ga=Ca}else{if((Ca|0)<1){Ha=(ya|0)==0|0;Ia=qe(A,62920)|0}else{Ha=ya;Ia=Ca}Ja=Ia+ -1|0;if((Ha|0)==0){Fa=0;Ga=Ja}else{Ka=Ha;La=Ha;Ma=Ja;Na=67;break}}c[E+(N+~Aa<<2)>>2]=Da;Oa=0;Pa=Fa;Qa=za;Ra=Aa+1|0;Sa=Ga}else{Ka=1;La=ya;Ma=Ca;Na=67}}while(0);if((Na|0)==67){Na=0;c[E+(za<<2)>>2]=Da;Oa=Ka;Pa=La;Qa=za+1|0;Ra=Aa;Sa=Ma}Ea=B+(Da<<2)|0;c[Ea>>2]=Oa&1|c[Ea>>2]&-194|192;Ta=Pa;Ua=Qa;Va=Ra;Wa=Oa|Ba;Xa=Sa}else{Ta=ya;Ua=za;Va=Aa;Wa=Ba;Xa=Ca}Ea=xa+1|0;if((Ea|0)<4){xa=Ea;ya=Ta;za=Ua;Aa=Va;Ba=Wa;Ca=Xa}else{break}}a[K+(ra|na)|0]=Wa;ta=Ta;ua=Ua;va=Va;wa=Xa}Ca=ra+1|0;if((Ca|0)<4){oa=ta;pa=ua;qa=va;ra=Ca;sa=wa}else{Ya=ta;Za=ua;_a=va;$a=wa;break}}}else{sa=ha;ra=ia;qa=ja;pa=0;oa=ka;while(1){if(((d[ma]|0)>>>2&15&1<<pa|0)==0){ab=sa;bb=ra;cb=qa;db=oa}else{na=0;Ca=sa;Ba=ra;Aa=qa;za=oa;while(1){ya=c[J+(la<<6)+(pa<<4)+(na<<2)>>2]|0;if((ya|0)>-1){xa=a[ma]|0;do{if((xa&1)==0){if((xa&2)==0){eb=Ca;gb=za}else{if((za|0)<1){hb=(Ca|0)==0|0;ib=qe(A,62920)|0}else{hb=Ca;ib=za}F=ib+ -1|0;if((hb|0)==0){eb=0;gb=F}else{jb=hb;kb=hb;mb=F;Na=79;break}}c[E+(N+~Aa<<2)>>2]=ya;nb=0;ob=eb;pb=Ba;qb=Aa+1|0;rb=gb}else{jb=1;kb=Ca;mb=za;Na=79}}while(0);if((Na|0)==79){Na=0;c[E+(Ba<<2)>>2]=ya;nb=jb;ob=kb;pb=Ba+1|0;qb=Aa;rb=mb}xa=B+(ya<<2)|0;c[xa>>2]=nb&1|c[xa>>2]&-194|192;sb=ob;tb=pb;ub=qb;vb=rb}else{sb=Ca;tb=Ba;ub=Aa;vb=za}xa=na+1|0;if((xa|0)<4){na=xa;Ca=sb;Ba=tb;Aa=ub;za=vb}else{ab=sb;bb=tb;cb=ub;db=vb;break}}}za=pa+1|0;if((za|0)<4){sa=ab;ra=bb;qa=cb;pa=za;oa=db}else{Ya=ab;Za=bb;_a=cb;$a=db;break}}}oa=la+1|0;if(oa>>>0<T>>>0){ha=Ya;ia=Za;ja=_a;ka=$a;la=oa}else{wb=Ya;xb=Za;yb=_a;zb=$a;Ab=T;break}}}else{wb=Q;xb=C;yb=P;zb=S;Ab=L}c[f+220+(M<<2)>>2]=xb-C;la=M+1|0;if((la|0)<3){Q=wb;C=xb;P=yb;M=la;S=zb;L=Ab;O=T}else{break}}c[f+232>>2]=xb;z=xb}}while(0);xb=f+872|0;do{if((a[xb]|0)==0){Bb=z}else{Ab=f+524|0;zb=f+528|0;if((c[Ab>>2]|0)>=0){if((c[zb>>2]|0)>=0){Bb=z;break}}c[Ab>>2]=0;c[zb>>2]=0;c[f+532>>2]=0;zb=c[f+248>>2]|0;c[f+556>>2]=zb;c[f+552>>2]=zb;c[f+548>>2]=zb;Cb=f+54056|0;Db=f+236|0;Eb=Cb+48|0;do{c[Cb>>2]=c[Db>>2];Cb=Cb+4|0;Db=Db+4|0}while((Cb|0)<(Eb|0));Ab=c[f+576>>2]|0;yb=(Ab|0)>-1?Ab:0-Ab|0;Ab=c[f+8>>2]|0;wb=Ab+32|0;$a=c[f+580>>2]|0;hf(zb+(-16-($(yb,Ab+15|0)|0))|0,-128,($(yb,wb)|0)+16+($((($a|0)>-1?$a:0-$a|0)<<1,wb>>((c[f+48>>2]|0)>>>1&1^1))|0)|0)|0;Bb=c[f+232>>2]|0}}while(0);z=f+232|0;if((Bb|0)<1){Bb=f+848|0;wb=c[Bb>>2]|0;$a=c[Bb+4>>2]|0;Bb=mf(d[f+873|0]|0,0,wb|0,$a|0)|0;yb=jf(Bb|0,D|0,c[f+60>>2]|0)|0;Bb=D;Ab=f+856|0;_a=Ab;Za=c[_a>>2]|0;Ya=c[_a+4>>2]|0;_a=lf(Za|0,Ya|0,wb|0,$a|0)|0;$a=mf(_a|0,D|0,yb|0,Bb|0)|0;Bb=D;yb=f+864|0;c[yb>>2]=$a;c[yb+4>>2]=Bb;yb=mf(Za|0,Ya|0,1,0)|0;Ya=Ab;c[Ya>>2]=yb;c[Ya+4>>2]=D;if((h|0)==0){x=1;i=j;return x|0}Ya=h;c[Ya>>2]=$a;c[Ya+4>>2]=Bb;x=1;i=j;return x|0}Bb=f+528|0;Ya=f+524|0;$a=c[Ya>>2]|0;yb=c[Bb>>2]|0;Ab=0;while(1){if(!((Ab|0)==($a|0)|(Ab|0)==(yb|0))){break}Ab=Ab+1|0}yb=f+532|0;c[yb>>2]=Ab;$a=f+556|0;c[$a>>2]=c[f+236+(Ab*48|0)+12>>2];do{if((a[xb]|0)==0){Za=f+856|0;_a=c[Za+4>>2]|0;wb=f+848|0;c[wb>>2]=c[Za>>2];c[wb+4>>2]=_a}else{_a=f+51636|0;wb=Se(_a,3)|0;if((wb|0)==0){Za=u;c[Za>>2]=0;c[Za+4>>2]=0;a[v+(Se(_a,3)|0)|0]=0;a[v+(Se(_a,3)|0)|0]=1;a[v+(Se(_a,3)|0)|0]=2;a[v+(Se(_a,3)|0)|0]=3;a[v+(Se(_a,3)|0)|0]=4;a[v+(Se(_a,3)|0)|0]=5;a[v+(Se(_a,3)|0)|0]=6;a[v+(Se(_a,3)|0)|0]=7;Fb=v}else{Fb=62784+(wb+ -1<<3)|0}Za=(wb|0)==7?62840:62864;wb=f+200|0;db=c[wb>>2]|0;cb=f+212|0;bb=c[cb>>2]|0;if((bb|0)!=0){ab=0;do{vb=db+ab|0;if((a[vb]|0)>0){a[vb]=a[Fb+(qe(_a,Za)|0)|0]|0}ab=ab+1|0;}while(ab>>>0<bb>>>0)}bb=f+48|0;ab=c[63320+(c[bb>>2]<<2)>>2]|0;Za=(Te(_a)|0)!=0;db=Za?62440:62576;Za=c[bb>>2]|0;bb=a[63296+Za|0]|0;zb=bb&255;vb=c[f+168>>2]|0;ub=c[f+176>>2]|0;tb=c[f+196>>2]|0;sb=c[wb>>2]|0;rb=c[cb>>2]|0;if((rb|0)==0){break}qb=(bb&255)>4;bb=t+2|0;pb=t+4|0;ob=t+6|0;nb=0;mb=0;kb=0;while(1){jb=a[sb+mb|0]|0;gb=jb<<24>>24;do{if(jb<<24>>24==7){eb=c[tb+(mb*48|0)>>2]|0;hb=vb+(eb<<2)|0;ib=c[hb>>2]|0;if((ib&1|0)==0){b[s>>1]=0;Gb=nb}else{c[hb>>2]=ib&-1985|1856;ib=(qe(_a,db)|0)+224|0;hb=(((qe(_a,db)|0)<<8)+57344|ib&255)&65535;b[s>>1]=hb;b[ub+(eb<<1)>>1]=hb;Gb=hb}hb=c[tb+(mb*48|0)+4>>2]|0;eb=vb+(hb<<2)|0;ib=c[eb>>2]|0;if((ib&1|0)==0){b[bb>>1]=0;Hb=Gb}else{c[eb>>2]=ib&-1985|1856;ib=(qe(_a,db)|0)+224|0;eb=(((qe(_a,db)|0)<<8)+57344|ib&255)&65535;b[bb>>1]=eb;b[ub+(hb<<1)>>1]=eb;Hb=eb}eb=c[tb+(mb*48|0)+8>>2]|0;hb=vb+(eb<<2)|0;ib=c[hb>>2]|0;if((ib&1|0)==0){b[pb>>1]=0;Ib=Hb}else{c[hb>>2]=ib&-1985|1856;ib=(qe(_a,db)|0)+224|0;hb=(((qe(_a,db)|0)<<8)+57344|ib&255)&65535;b[pb>>1]=hb;b[ub+(eb<<1)>>1]=hb;Ib=hb}hb=c[tb+(mb*48|0)+12>>2]|0;eb=vb+(hb<<2)|0;ib=c[eb>>2]|0;if((ib&1|0)==0){b[ob>>1]=0;Jb=Ib}else{c[eb>>2]=ib&-1985|1856;ib=(qe(_a,db)|0)+224|0;eb=(((qe(_a,db)|0)<<8)+57344|ib&255)&65535;b[ob>>1]=eb;b[ub+(hb<<1)>>1]=eb;Jb=eb}fb[ab&7](r,t);if(qb){Kb=4}else{Lb=Jb;Mb=nb;break}while(1){eb=d[63248+(Za*12|0)+Kb|0]|0;hb=eb&3;ib=c[tb+(mb*48|0)+(eb>>>2<<4)+(hb<<2)>>2]|0;eb=vb+(ib<<2)|0;wa=c[eb>>2]|0;if((wa&1|0)!=0){c[eb>>2]=wa&-1985|1856;b[ub+(ib<<1)>>1]=b[r+(hb<<1)>>1]|0}hb=Kb+1|0;if((hb|0)<(zb|0)){Kb=hb}else{Lb=Jb;Mb=nb;break}}}else if(jb<<24>>24==-1){Lb=nb;Mb=kb}else{if((gb|0)==4){Nb=kb;Ob=kb;Pb=nb}else if((gb|0)==2){hb=(qe(_a,db)|0)+224|0;ib=(((qe(_a,db)|0)<<8)+57344|hb&255)&65535;Nb=ib;Ob=ib;Pb=nb}else if((gb|0)==6){ib=(qe(_a,db)|0)+224|0;Nb=nb;Ob=(((qe(_a,db)|0)<<8)+57344|ib&255)&65535;Pb=kb}else if((gb|0)==3){Nb=nb;Ob=nb;Pb=kb}else{Nb=nb;Ob=0;Pb=kb}ib=268505377>>>(gb<<2)<<6&192|gb<<8&1792;hb=0;while(1){wa=d[63248+(Za*12|0)+hb|0]|0;eb=c[tb+(mb*48|0)+(wa>>>2<<4)+((wa&3)<<2)>>2]|0;wa=vb+(eb<<2)|0;va=c[wa>>2]|0;if((va&1|0)!=0){c[wa>>2]=ib|va&-1985;b[ub+(eb<<1)>>1]=Ob}eb=hb+1|0;if((eb|0)<(zb|0)){hb=eb}else{Lb=Nb;Mb=Pb;break}}}}while(0);gb=mb+1|0;if(gb>>>0<rb>>>0){nb=Lb;mb=gb;kb=Mb}else{break}}}}while(0);Mb=c[z>>2]|0;c:do{if((Mb|0)>=1){z=c[f+168>>2]|0;Lb=c[f+216>>2]|0;Pb=f+874|0;if((a[Pb]|0)==1){Nb=0;while(1){Ob=z+(c[Lb+(Nb<<2)>>2]<<2)|0;c[Ob>>2]=c[Ob>>2]&-61;Nb=Nb+1|0;if((Nb|0)>=(Mb|0)){break c}}}Nb=f+51636|0;Ob=Te(Nb)|0;Jb=0;Kb=0;while(1){r=qe(Nb,62392)|0;if((r|0)>15){t=r&31;Qb=t+6+(Se(Nb,r-t>>4)|0)|0}else{Qb=r}r=Ob<<2&60;t=Jb+1|0;Ib=Jb-((Mb|0)>(t|0)?Mb:t)|0;t=0-Qb|0;Hb=~(((t|0)>-1?t:-1)+Qb);t=Ib>>>0>Hb>>>0?Ib:Hb;Hb=$(t,Ob)|0;Ib=Jb;Gb=Qb;while(1){s=Ib+1|0;Fb=z+(c[Lb+(Ib<<2)>>2]<<2)|0;c[Fb>>2]=c[Fb>>2]&-61|r;Fb=Gb+ -1|0;Rb=(s|0)<(Mb|0);if((Fb|0)>0&Rb){Gb=Fb;Ib=s}else{break}}Sb=Kb-Hb|0;Ib=Jb-t|0;if((Qb|0)>4128&Rb){Tb=Te(Nb)|0}else{Tb=(Ob|0)==0|0}if((Ib|0)<(Mb|0)){Ob=Tb;Jb=Ib;Kb=Sb}else{break}}if((a[Pb]|0)==3&(Sb|0)>0){Ub=0}else{break}while(1){if((c[z+(c[Lb+(Ub<<2)>>2]<<2)>>2]&60|0)==0){Ub=Ub+1|0}else{break}}Pb=Te(Nb)|0;Kb=Ub;while(1){Jb=qe(Nb,62392)|0;if((Jb|0)>15){Ob=Jb&31;Vb=Ob+6+(Se(Nb,Jb-Ob>>4)|0)|0}else{Vb=Jb}if((Kb|0)<(Mb|0)){Wb=Kb;Xb=Vb}else{break c}while(1){Jb=z+(c[Lb+(Wb<<2)>>2]<<2)|0;Ob=c[Jb>>2]|0;Ib=Ob>>>2;if((Ib&15|0)==0){Yb=Xb}else{if((Xb|0)<1){break}c[Jb>>2]=Ib+Pb<<2&60|Ob&-61;Yb=Xb+ -1|0}Ob=Wb+1|0;if((Ob|0)<(Mb|0)){Wb=Ob;Xb=Yb}else{break c}}if((Vb|0)<4129){Pb=(Pb|0)==0|0;Kb=Wb;continue}else{Pb=Te(Nb)|0;Kb=Wb;continue}}}}while(0);Wb=f+220|0;Vb=c[Wb>>2]|0;Yb=0;do{c[o+(Yb<<2)>>2]=Vb;Yb=Yb+1|0;}while((Yb|0)<64);Yb=f+224|0;Vb=c[Yb>>2]|0;Xb=0;do{c[o+256+(Xb<<2)>>2]=Vb;Xb=Xb+1|0;}while((Xb|0)<64);Xb=f+228|0;Vb=c[Xb>>2]|0;Mb=0;do{c[o+512+(Mb<<2)>>2]=Vb;Mb=Mb+1|0;}while((Mb|0)<64);Mb=f+51636|0;c[p>>2]=Se(Mb,4)|0;Vb=q+4|0;c[Vb>>2]=Se(Mb,4)|0;c[f+52744>>2]=0;Ub=f+53512|0;Sb=c[Ub>>2]|0;Tb=f+168|0;Rb=c[Tb>>2]|0;Qb=f+216|0;Kb=c[Qb>>2]|0;Nb=n+252|0;Pb=0;Lb=0;z=0;t=0;Hb=0;while(1){Ob=c[f+220+(t<<2)>>2]|0;Ib=Ob+z|0;hf(m|0,0,256)|0;c[f+52744+(t<<8)>>2]=Pb;c[f+51976+(t<<8)>>2]=Hb;Jb=Ib-Lb|0;Gb=(Jb|0)<(Pb|0)?Jb:Pb;Jb=Pb-Gb|0;if((Gb|0)>0){r=Lb+ -1|0;s=r-z-Ob|0;Fb=Gb;v=Lb;while(1){u=Fb+ -1|0;kb=Rb+(c[Kb+(v<<2)>>2]<<2)|0;c[kb>>2]=c[kb>>2]&65535;if((u|0)>0){v=v+1|0;Fb=u}else{break}}Fb=~Pb;Zb=r-((s|0)<(Fb|0)?Fb:s)|0}else{Zb=Lb}d:do{if((Zb|0)<(Ib|0)){Fb=~z-Ob|0;v=f+51656+(c[q+(t+1>>1<<2)>>2]<<2)|0;u=Gb;kb=Zb;mb=Hb;while(1){nb=kb;rb=mb;while(1){zb=qe(Mb,c[v>>2]|0)|0;ub=rb+1|0;a[Sb+rb|0]=zb;if((zb|0)<15){vb=Se(Mb,d[62376+zb|0]|0)|0;tb=rb+2|0;a[Sb+ub|0]=vb;if((zb|0)==0){a[Sb+tb|0]=vb>>>8;_b=rb+3|0}else{_b=tb}$b=vb<<((zb|0)<2?-13:0)+((zb|0)<12?21:0);ac=_b}else{$b=0;ac=ub}ub=(c[62e3+(zb<<2)>>2]|0)+$b|0;bc=(ub|0)==0?2147483647:ub>>>8&4095;if((bc|0)!=0){break}zb=ub&255;vb=n+(zb<<2)|0;c[vb>>2]=(c[vb>>2]|0)+1;vb=nb+1|0;tb=Rb+(c[Kb+(nb<<2)>>2]<<2)|0;c[tb>>2]=c[tb>>2]&65535|((zb|0)!=0?0:(ub^0-(ub&1048576))>>21<<16);if((vb|0)<(Ib|0)){nb=vb;rb=ac}else{cc=u;dc=0;ec=vb;fc=ac;break d}}rb=Ib-nb|0;vb=(rb|0)<(bc|0)?rb-bc|0:0;rb=vb+bc|0;ub=rb+u|0;zb=0-vb|0;if((rb|0)>0){vb=nb+Fb|0;tb=rb;rb=nb;while(1){Za=tb+ -1|0;db=Rb+(c[Kb+(rb<<2)>>2]<<2)|0;c[db>>2]=c[db>>2]&65535;if((Za|0)>0){rb=rb+1|0;tb=Za}else{break}}tb=~bc;gc=nb+ -1-((vb|0)<(tb|0)?tb:vb)|0}else{gc=nb}if((gc|0)<(Ib|0)){u=ub;kb=gc;mb=ac}else{cc=ub;dc=zb;ec=gc;fc=ac;break}}}else{cc=Gb;dc=Jb;ec=Zb;fc=Hb}}while(0);Jb=(c[Nb>>2]|0)+cc|0;c[Nb>>2]=Jb;Gb=Jb;Jb=62;while(1){Ob=n+(Jb<<2)|0;s=(c[Ob>>2]|0)+Gb|0;c[Ob>>2]=s;if((Jb|0)>0){Jb=Jb+ -1|0;Gb=s}else{hc=63;break}}while(1){Gb=o+(t<<8)+(hc<<2)|0;c[Gb>>2]=(c[Gb>>2]|0)-(c[n+(hc<<2)>>2]|0);if((hc|0)>0){hc=hc+ -1|0}else{break}}Gb=t+1|0;if((Gb|0)<3){Pb=dc;Lb=ec;t=Gb;Hb=fc;z=Ib}else{break}}z=f+53520|0;c[z>>2]=fc;fc=Se(Mb,4)|0;c[p>>2]=fc;Hb=Se(Mb,4)|0;c[Vb>>2]=Hb;t=Hb;Hb=fc;fc=dc;dc=1;ec=1;while(1){Lb=Hb+16|0;c[p>>2]=Lb;Pb=t+16|0;c[Vb>>2]=Pb;hc=d[62368+dc|0]|0;if((ec|0)<(hc|0)){cc=ec+1|0;Zb=c[z>>2]|0;ac=fc;gc=ec;while(1){bc=c[Ub>>2]|0;Kb=64-gc|0;Rb=(Kb|0)>0;$b=ac;_b=0;Sb=Zb;while(1){c[f+52744+(_b<<8)+(gc<<2)>>2]=$b;c[f+51976+(_b<<8)+(gc<<2)>>2]=Sb;Gb=c[o+(_b<<8)+(gc<<2)>>2]|0;hf(m|0,0,256)|0;if($b>>>0<Gb>>>0){Jb=f+51656+(c[q+(_b+1>>1<<2)>>2]<<2)|0;s=$b;Ob=$b;r=0;mb=Sb;while(1){ic=r+Ob|0;kb=qe(Mb,c[Jb>>2]|0)|0;u=mb+1|0;a[bc+mb|0]=kb;if((kb|0)<15){Fb=Se(Mb,d[62376+kb|0]|0)|0;v=mb+2|0;a[bc+u|0]=Fb;if((kb|0)==0){a[bc+v|0]=Fb>>>8;jc=mb+3|0}else{jc=v}kc=Fb<<((kb|0)<2?-13:0)+((kb|0)<12?21:0);lc=jc}else{kc=0;lc=u}u=(c[62e3+(kb<<2)>>2]|0)+kc|0;kb=(u|0)==0?2147483647:u>>>8&4095;if((kb|0)==0){Fb=n+((u&255)<<2)|0;c[Fb>>2]=(c[Fb>>2]|0)+1;mc=0;nc=s+1|0}else{mc=kb;nc=s}kb=mc+nc|0;if(kb>>>0<Gb>>>0){s=kb;Ob=mc;mb=lc;r=ic}else{break}}oc=c[Nb>>2]|0;pc=mc;qc=ic;rc=nc;sc=lc}else{oc=0;pc=$b;qc=0;rc=0;sc=Sb}r=Gb-rc|0;mb=qc+oc+r|0;c[Nb>>2]=mb;Ob=mb;mb=62;while(1){s=n+(mb<<2)|0;Jb=(c[s>>2]|0)+Ob|0;c[s>>2]=Jb;if((mb|0)>0){mb=mb+ -1|0;Ob=Jb}else{break}}tc=pc-r|0;if(Rb){Ob=Kb;do{Ob=Ob+ -1|0;mb=o+(_b<<8)+(Ob+gc<<2)|0;c[mb>>2]=(c[mb>>2]|0)-(c[n+(Ob<<2)>>2]|0);}while((Ob|0)>0)}Ob=_b+1|0;if((Ob|0)<3){$b=tc;_b=Ob;Sb=sc}else{break}}c[z>>2]=sc;Sb=gc+1|0;if((Sb|0)<(hc|0)){Zb=sc;ac=tc;gc=Sb}else{break}}uc=tc;vc=(cc|0)>(hc|0)?cc:hc}else{uc=fc;vc=ec}gc=dc+1|0;if((gc|0)<5){fc=uc;dc=gc;ec=vc;Hb=Lb;t=Pb}else{break}}t=f+848|0;Hb=c[t>>2]|0;vc=c[t+4>>2]|0;t=mf(d[f+873|0]|0,0,Hb|0,vc|0)|0;ec=jf(t|0,D|0,c[f+60>>2]|0)|0;t=D;dc=f+856|0;uc=dc;fc=c[uc>>2]|0;tc=c[uc+4>>2]|0;uc=lf(fc|0,tc|0,Hb|0,vc|0)|0;vc=mf(uc|0,D|0,ec|0,t|0)|0;t=D;ec=f+864|0;c[ec>>2]=vc;c[ec+4>>2]=t;ec=mf(fc|0,tc|0,1,0)|0;tc=dc;c[tc>>2]=ec;c[tc+4>>2]=D;if((h|0)!=0){tc=h;c[tc>>2]=vc;c[tc+4>>2]=t}t=f+54112|0;tc=f+48|0;vc=f+57120|0;c[vc>>2]=4<<((c[tc>>2]|0)>>>1&1^1);ff(f+54624|0,f+51976|0,768)|0;ff(f+56160|0,f+52744|0,768)|0;h=c[Qb>>2]|0;ec=f+180|0;dc=c[ec>>2]|0;c[f+56928>>2]=h;c[f+56940>>2]=h+(dc<<2);fc=c[Wb>>2]|0;uc=fc-(c[f+84>>2]|0)+dc|0;c[f+56932>>2]=h+(fc<<2);c[f+56944>>2]=h+(uc<<2);dc=c[Yb>>2]|0;Hb=h+(dc-(c[f+116>>2]|0)+uc<<2)|0;c[f+56936>>2]=h+(dc+fc<<2);c[f+56948>>2]=Hb;Hb=f+874|0;do{if((a[Hb]|0)!=0){fc=0;do{dc=f+875+fc|0;c[f+56976+(fc<<3)>>2]=c[f+880+((d[dc]|0)*24|0)>>2];c[f+56976+(fc<<3)+4>>2]=c[f+880+((d[dc]|0)*24|0)+4>>2];fc=fc+1|0;wc=a[Hb]|0;}while((fc|0)<(wc&255|0));if(wc<<24>>24==0){break}else{xc=0}do{fc=f+875+xc|0;c[f+57e3+(xc<<3)>>2]=c[f+880+((d[fc]|0)*24|0)+8>>2];c[f+57e3+(xc<<3)+4>>2]=c[f+880+((d[fc]|0)*24|0)+12>>2];xc=xc+1|0;yc=a[Hb]|0;}while((xc|0)<(yc&255|0));if(yc<<24>>24==0){break}else{zc=0}do{fc=f+875+zc|0;c[f+57024+(zc<<3)>>2]=c[f+880+((d[fc]|0)*24|0)+16>>2];c[f+57024+(zc<<3)+4>>2]=c[f+880+((d[fc]|0)*24|0)+20>>2];zc=zc+1|0;}while((zc|0)<(d[Hb]|0))}}while(0);Cb=f+57072|0;Eb=Cb+48|0;do{c[Cb>>2]=0;Cb=Cb+4|0}while((Cb|0)<(Eb|0));Hb=f+875|0;zc=a[f+51568+(d[Hb]|0)|0]|0;yc=zc<<24>>24!=0;xc=f+57124|0;c[xc>>2]=yc&1;if(yc){Ke(f+54368|0,zc&255)}zc=f+53524|0;yc=c[zc>>2]|0;wc=f+54040|0;fc=c[wc>>2]|0;Pb=(fc|0)==0;e:do{if((yc|0)<1){if(Pb){Na=244;break}Ze(fc);c[wc>>2]=0;Lb=f+54044|0;Ze(c[Lb>>2]|0);c[Lb>>2]=0;Lb=f+54048|0;Ze(c[Lb>>2]|0);c[Lb>>2]=0;Na=244}else{do{if(Pb){if((a[xb]|0)!=0){Na=244;break e}Lb=c[ec>>2]|0;hc=Ye(Lb)|0;c[wc>>2]=hc;if((hc|0)==0){Na=244;break e}hf(hc|0,a[Hb]|0,Lb|0)|0;Ac=yc}else{Lb=c[Qb>>2]|0;hc=(c[Yb>>2]|0)+(c[Wb>>2]|0)+(c[Xb>>2]|0)|0;cc=a[Hb]|0;if((hc|0)>0){Bc=0}else{Ac=yc;break}do{a[fc+(c[Lb+(Bc<<2)>>2]|0)|0]=cc;Bc=Bc+1|0;}while((Bc|0)<(hc|0));Ac=c[zc>>2]|0}}while(0);hc=f+54044|0;cc=c[hc>>2]|0;Lb=(cc|0)==0;if((Ac|0)<2){if(Lb){Na=244;break}Ze(cc);c[hc>>2]=0;cc=f+54048|0;Ze(c[cc>>2]|0);c[cc>>2]=0;Na=244;break}f:do{if(Lb){cc=c[f+4>>2]|0;dc=c[f+8>>2]|0;h=$(dc,cc)|0;uc=c[tc>>2]|0;sc=Ye(($(cc>>>(uc&1^1)<<1,dc>>>(uc>>>1&1^1))|0)+h|0)|0;h=f+54048|0;c[h>>2]=sc;uc=Ye(c[ec>>2]<<2)|0;c[hc>>2]=uc;do{if((uc|0)==0){Cc=sc}else{if((sc|0)==0){Cc=0;break}c[f+54052>>2]=0;Dc=cc;Na=237;break f}}while(0);Ze(Cc);c[h>>2]=0;Ze(c[hc>>2]|0);c[hc>>2]=0;Na=244;break e}else{if((c[f+54052>>2]|0)==(((Ac|0)>4?2:1)|0)){Ec=Ac;break}Dc=c[f+4>>2]|0;Na=237}}while(0);if((Na|0)==237){if((Ac|0)<5){c[f+54056>>2]=Dc;Lb=c[f+8>>2]|0;c[f+54060>>2]=Lb;cc=0-Dc|0;c[f+54064>>2]=cc;c[f+54068>>2]=(c[f+54048>>2]|0)+($(1-Lb|0,cc)|0);Fc=Ac}else{cc=c[f+8>>2]|0;Lb=$(cc,Dc)|0;sc=c[tc>>2]|0;uc=Dc>>>(sc&1^1);dc=cc>>>(sc>>>1&1^1);sc=$(dc,uc)|0;z=f+54056|0;c[z>>2]=Dc;c[f+54060>>2]=cc;c[f+54064>>2]=Dc;cc=c[f+54048>>2]|0;c[f+54068>>2]=cc;c[f+54072>>2]=uc;c[f+54076>>2]=dc;c[f+54080>>2]=uc;c[f+54084>>2]=cc+Lb;c[f+54088>>2]=uc;c[f+54092>>2]=dc;c[f+54096>>2]=uc;c[f+54100>>2]=cc+(sc+Lb);ze(z,z);Fc=c[zc>>2]|0}c[f+54052>>2]=(Fc|0)>4?2:1;Ec=Fc}if((Ec|0)<5){z=f+54072|0;Lb=f+236+((c[yb>>2]|0)*48|0)+16|0;c[z+0>>2]=c[Lb+0>>2];c[z+4>>2]=c[Lb+4>>2];c[z+8>>2]=c[Lb+8>>2];c[z+12>>2]=c[Lb+12>>2];c[z+16>>2]=c[Lb+16>>2];c[z+20>>2]=c[Lb+20>>2];c[z+24>>2]=c[Lb+24>>2];c[z+28>>2]=c[Lb+28>>2]}c[f+57128>>2]=Ec;Gc=hc}}while(0);if((Na|0)==244){c[f+57128>>2]=0;Cb=f+54056|0;Db=f+236+((c[yb>>2]|0)*48|0)+0|0;Eb=Cb+48|0;do{c[Cb>>2]=c[Db>>2];Cb=Cb+4|0;Db=Db+4|0}while((Cb|0)<(Eb|0));Gc=f+54044|0}Cb=t+0|0;Eb=Cb+128|0;do{b[Cb>>1]=0;Cb=Cb+2|0}while((Cb|0)<(Eb|0));ze(w,f+54056|0);Cb=f+76|0;Eb=f+64|0;Db=l+2|0;Ec=f+552|0;Fc=f+172|0;Dc=f+57128|0;Ac=f+54368|0;Cc=f+54108|0;ec=f+54104|0;Bc=c[vc>>2]|0;fc=0;yc=0;while(1){Hb=c[Cb>>2]|0;Xb=(Bc+yc|0)<(Hb|0);Wb=Xb&1;Yb=Hb;Qb=Hb;Hb=0;do{Pb=(Hb|0)!=0;if(Pb){Hc=(c[tc>>2]|0)>>>1&1^1}else{Hc=0}Lb=yc>>Hc;z=f+57048+(Hb<<2)|0;c[z>>2]=Lb;sc=f+72+(Hb<<5)+4|0;cc=c[sc>>2]|0;uc=(c[vc>>2]>>Hc)+Lb|0;Lb=f+57060+(Hb<<2)|0;c[Lb>>2]=(uc|0)<(cc|0)?uc:cc;Yd(f,t,Hb);cc=c[Ub>>2]|0;uc=c[Eb>>2]|0;dc=c[Tb>>2]|0;n=f+56928+(Hb<<2)|0;o=c[n>>2]|0;pc=c[f+56952+(Hb<<2)>>2]|0;b[k>>1]=b[c[f+56976+(Hb*24|0)>>2]>>1]|0;b[Db>>1]=b[c[f+56976+(Hb*24|0)+4>>2]>>1]|0;if((pc|0)>0){Nb=0;do{oc=c[o+(Nb<<2)>>2]|0;qc=dc+(oc<<2)|0;rc=c[qc>>2]|0;lc=(rc&1792|0)!=256|0;nc=c[f+56976+(Hb*24|0)+((rc>>>2&15)<<3)+(lc<<2)>>2]|0;rc=0;while(1){Ic=f+56160+(Hb<<8)+(rc<<2)|0;Jc=c[Ic>>2]|0;if((Jc|0)!=0){Na=257;break}ic=f+54624+(Hb<<8)+(rc<<2)|0;mc=c[ic>>2]|0;kc=mc+1|0;jc=a[cc+mc|0]|0;Mb=c[62e3+((jc&255)<<2)>>2]|0;do{if((jc&255)<15){q=mc+2|0;m=(d[cc+kc|0]<<((jc&255)<2?-13:0)+((jc&255)<12?21:0))+Mb|0;Vb=m>>>8&4095;if(!(jc<<24>>24==0)){Kc=m;Lc=Vb;Mc=q;break}p=(d[cc+q|0]<<8)+Vb|0;Kc=m;Lc=(p|0)==0?2147483647:p;Mc=mc+3|0}else{Kc=Mb;Lc=Mb>>>8&4095;Mc=kc}}while(0);c[Ic>>2]=Lc;c[ic>>2]=Mc;kc=(Kc&255)+rc|0;Mb=($(e[nc+(kc<<1)>>1]|0,(Kc^0-(Kc&1048576))>>21)|0)&65535;b[f+54112+(d[uc+kc|0]<<1)>>1]=Mb;Mb=((Lc|0)==0)+kc|0;if((Mb|0)<64){rc=Mb}else{break}}if((Na|0)==257){Na=0;c[Ic>>2]=Jc+ -1}b[t>>1]=(c[qc>>2]|0)>>>16;Je(f,oc,Hb,t,rc,b[l+(lc<<1)>>1]|0);Nb=Nb+1|0;}while((Nb|0)<(pc|0));Nc=c[n>>2]|0}else{Nc=o}c[n>>2]=Nc+(pc<<2);Nb=c[f+56964+(Hb<<2)>>2]|0;if((Nb|0)>0){uc=f+56940+(Hb<<2)|0;cc=(c[uc>>2]|0)+(0-Nb<<2)|0;c[uc>>2]=cc;ge(c[$a>>2]|0,c[Ec>>2]|0,c[f+576+(Hb<<2)>>2]|0,cc,Nb,c[Fc>>2]|0)}if((c[xc>>2]|0)==0){Oc=0;Pc=0}else{Le(f,Ac,2,Hb,(c[z>>2]|0)-fc|0,(c[Lb>>2]|0)-Wb|0);Oc=Wb;Pc=fc}He(f,Ab,Hb,((c[z>>2]|0)-Pc<<3)-(Pc<<1)|0,((c[Lb>>2]|0)-Oc<<3)-(Oc<<1)|0);Nb=Pb?3:0;do{if((c[Dc>>2]|0)<(Nb+2|0)){if((c[xc>>2]|0)==0){Qc=Oc;Rc=Pc;break}Qc=Oc+Wb|0;Rc=Pc+fc|0}else{cc=Pc+fc|0;uc=Oc+Wb|0;dc=(c[z>>2]|0)-cc|0;h=(c[Lb>>2]|0)-uc|0;nc=f+72+(Hb<<5)|0;Mb=c[nc>>2]|0;kc=f+72+(Hb<<5)+8|0;mc=c[kc>>2]|0;jc=$(Mb,dc)|0;p=mc+jc|0;m=c[Gc>>2]|0;Vb=m+(p<<2)|0;q=c[wc>>2]|0;gc=q+p|0;ac=(dc|0)>0;Zb=(c[sc>>2]|0)>(h|0);Ib=Zb&1;hf(m+(p+(ac?Mb:0)<<2)|0,0,$(Mb<<2,h-dc+(ac<<31>>31)+Ib|0)|0)|0;p=(ac&1)<<2|dc<<3;dc=f+54056+(Hb<<4)+8|0;ac=c[dc>>2]|0;Sb=c[f+236+(Ab*48|0)+(Hb<<4)+8>>2]|0;_b=f+54056+(Hb<<4)+12|0;$b=c[_b>>2]|0;Kb=$b+($(ac,p)|0)|0;Rb=c[f+236+(Ab*48|0)+(Hb<<4)+12>>2]|0;bc=Rb+($(Sb,p)|0)|0;Ob=f+54056+(Hb<<4)|0;r=c[Ob>>2]|0;if((p|0)<4){mb=Sb<<2;Gb=Kb;Jb=bc;s=p;while(1){ff(Gb|0,Jb|0,r|0)|0;zb=s+1|0;if((zb|0)<4){s=zb;Jb=Jb+Sb|0;Gb=Gb+ac|0}else{break}}Sc=$b+(ac<<2)|0;Tc=Rb+mb|0;Uc=4}else{Sc=Kb;Tc=bc;Uc=p}Gb=h-(Ib^1)<<3;if((Uc|0)<(Gb|0)){Jb=0-Sb|0;s=ac<<3;lc=Sb<<3;rc=Mb+1|0;oc=-4-(ac<<2)|0;qc=Gb+ -1-Uc|0;if((r|0)>8){zb=gc;ub=Sc;nb=Tc;vb=Vb;kb=Uc;while(1){Fb=c[f+53528+(d[zb]<<2)>>2]|0;ce(ub,ac,nb+Jb|0,Sb,Fb,Fb*3>>2,vb,vb+(Mb<<2)|0);Fb=zb+1|0;u=vb;v=vb+4|0;tb=8;while(1){rb=c[f+53528+(d[Fb]<<2)>>2]|0;Za=rb*3>>2;ce(ub+tb|0,ac,nb+(tb-Sb)|0,Sb,rb,Za,v,u+(rc<<2)|0);de(ub+(oc+tb)|0,ac,rb,Za,u);Za=tb+8|0;Vc=v+4|0;Wc=Fb+1|0;if((Za|0)<(r|0)){rb=v;tb=Za;v=Vc;u=rb;Fb=Wc}else{break}}Fb=kb+8|0;if((Fb|0)<(Gb|0)){zb=Wc;ub=ub+s|0;nb=nb+lc|0;vb=Vc;kb=Fb}else{break}}Xc=qc&-8;Yc=Vc;Zc=Wc}else{kb=qc>>>3;vb=mc+1+jc+kb|0;nb=gc;ub=Sc;zb=Tc;oc=Vb;rc=Uc;while(1){Ib=c[f+53528+(d[nb]<<2)>>2]|0;ce(ub,ac,zb+Jb|0,Sb,Ib,Ib*3>>2,oc,oc+(Mb<<2)|0);Ib=rc+8|0;if((Ib|0)<(Gb|0)){rc=Ib;oc=oc+4|0;zb=zb+lc|0;ub=ub+s|0;nb=nb+1|0}else{break}}Xc=kb<<3;Yc=m+(vb<<2)|0;Zc=q+vb|0}nb=Xc+8|0;_c=Zc;$c=Sc+($(nb,ac)|0)|0;ad=Tc+($(nb,Sb)|0)|0;bd=Yc;cd=Uc+8+Xc|0}else{_c=gc;$c=Sc;ad=Tc;bd=Vb;cd=Uc}do{if(!Zb){nb=c[f+54056+(Hb<<4)+4>>2]|0;if((cd|0)<(nb|0)){s=nb-cd|0;ub=$c;lc=ad;zb=cd;while(1){ff(ub|0,lc|0,r|0)|0;oc=zb+1|0;if((oc|0)<(nb|0)){zb=oc;lc=lc+Sb|0;ub=ub+ac|0}else{break}}dd=$c+($(s,ac)|0)|0}else{dd=$c}if((r|0)<=8){break}ub=-4-(ac<<3)|0;lc=_c;zb=bd;nb=8;while(1){oc=lc+1|0;rc=c[f+53528+(d[oc]<<2)>>2]|0;de(dd+(ub+nb)|0,ac,rc,rc*3>>2,zb);rc=nb+8|0;if((rc|0)<(r|0)){nb=rc;zb=zb+4|0;lc=oc}else{break}}}}while(0);if((c[Dc>>2]|0)<(Nb+3|0)){Qc=uc;Rc=cc;break}r=cc+fc|0;ac=uc+Wb|0;Sb=(c[z>>2]|0)-r|0;Zb=c[nc>>2]|0;Vb=(c[kc>>2]|0)+($(Zb,Sb)|0)|0;gc=(c[zc>>2]|0)>=((Pb?7:4)|0);vb=Pb?3840:1920;q=Sb<<3;Sb=c[dc>>2]|0;m=(c[Lb>>2]|0)-ac<<3;kb=c[Ob>>2]|0;lc=c[f+54056+(Hb<<4)+4>>2]|0;if((q|0)>=(m|0)){Qc=ac;Rc=r;break}zb=$(Sb,q)|0;nb=(kb|0)>0;ub=Sb<<3;s=0-Zb|0;oc=(c[Tb>>2]|0)+(Vb<<2)|0;rc=(c[_b>>2]|0)+zb|0;zb=(c[Gc>>2]|0)+(Vb<<2)|0;Vb=q;while(1){if(nb){q=(Vb|0)<1;Gb=Vb+8|0;Mb=(Gb|0)>=(lc|0);Jb=(Mb&1)<<3|(q&1)<<2;jc=oc;mc=zb;qc=0;while(1){Ib=d[f+875+((c[jc>>2]|0)>>>2&15)|0]|0;h=c[mc>>2]|0;p=(qc|0)<1;bc=qc+8|0;Kb=(bc|0)>=(kb|0);mb=Jb|p&1|(Kb&1)<<1;g:do{if(gc&(h|0)>(vb|0)){Rb=rc+qc|0;$b=f+53528+(Ib<<2)|0;Fb=f+53784+(Ib<<2)|0;be(Rb,Sb,mb,c[$b>>2]|0,c[Fb>>2]|0,1);do{if(!Pb){if(!p){if((c[mc+ -4>>2]|0)>3840){break}}if(!Kb){if((c[mc+4>>2]|0)>3840){break}}if(!q){if((c[mc+(s<<2)>>2]|0)>3840){break}}if(Mb){break g}if((c[mc+(Zb<<2)>>2]|0)<=3840){break g}}}while(0);be(Rb,Sb,mb,c[$b>>2]|0,c[Fb>>2]|0,1);be(Rb,Sb,mb,c[$b>>2]|0,c[Fb>>2]|0,1)}else{if((h|0)>1536){be(rc+qc|0,Sb,mb,c[f+53528+(Ib<<2)>>2]|0,c[f+53784+(Ib<<2)>>2]|0,1);break}if((h|0)<=384){break}be(rc+qc|0,Sb,mb,c[f+53528+(Ib<<2)>>2]|0,c[f+53784+(Ib<<2)>>2]|0,0)}}while(0);Ib=jc+4|0;mb=mc+4|0;if((bc|0)<(kb|0)){jc=Ib;mc=mb;qc=bc}else{ed=Gb;fd=Ib;gd=mb;break}}}else{ed=Vb+8|0;fd=oc;gd=zb}if((ed|0)<(m|0)){oc=fd;rc=rc+ub|0;zb=gd;Vb=ed}else{Qc=ac;Rc=r;break}}}}while(0);Pb=(c[z>>2]|0)-Rc<<Hc;Yb=(Pb|0)<(Yb|0)?Pb:Yb;Pb=(c[Lb>>2]|0)-Qc<<Hc;Qb=(Pb|0)<(Qb|0)?Pb:Qb;Hb=Hb+1|0;}while((Hb|0)<3);Hb=c[Cc>>2]|0;if((Hb|0)!=0){Wb=c[Cb>>2]|0;lb[Hb&7](c[ec>>2]|0,w,Wb-Qb|0,Wb-Yb|0)}Wb=c[vc>>2]|0;if(Xb){Bc=Wb;fc=1;yc=Wb+yc|0}else{break}}Ie(f,Ab,0);Ie(f,Ab,1);Ie(f,Ab,2);Ab=(a[xb]|0)==0;xb=c[yb>>2]|0;c[Bb>>2]=xb;if(Ab){c[Ya>>2]=xb;xb=c[$a>>2]|0;c[Ec>>2]=xb;c[f+548>>2]=xb;x=0;i=j;return x|0}else{c[Ec>>2]=c[$a>>2];x=0;i=j;return x|0}return 0}function ae(a,b){a=a|0;b=b|0;var c=0,d=0;c=i;if((a|0)==0|(b|0)==0){d=-1;i=c;return d|0}ze(b,a+54056|0);d=0;i=c;return d|0}function be(b,e,f,g,h,j){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;k=i;i=i+576|0;l=k;m=k+288|0;n=g*3|0;o=d[61984+j|0]|0;p=(o|0)<(n|0)?o:n;n=b+(0-(0-(f>>>2&1^1)&e))|0;o=g+32|0;g=d[61992+j|0]|0;j=f>>>3&1^1;q=0;r=n;s=b;while(1){t=q<<3;u=0;do{v=(d[s+u|0]|0)-(d[r+u|0]|0)|0;w=o-(((v|0)>-1?v:0-v|0)<<g)|0;if((w|0)<-64){x=h}else{v=(p|0)<(w|0)?p:w;x=(v|0)>0?v:0}c[l+(u+t<<2)>>2]=x;u=u+1|0;}while((u|0)<8);u=s+(0-((q|0)<7|j)&e)|0;t=q+1|0;if((t|0)<9){v=s;q=t;s=u;r=v}else{break}}r=0-(f&1^1)|0;s=f>>>1&1;f=s^1;q=0;x=b;v=b+r|0;while(1){u=q<<3;t=0;w=v;y=x;while(1){z=(d[y]|0)-(d[w]|0)|0;A=o-(((z|0)>-1?z:0-z|0)<<g)|0;if((A|0)<-64){B=h}else{z=(p|0)<(A|0)?p:A;B=(z|0)>0?z:0}c[m+(t+u<<2)>>2]=B;z=t+1|0;if((z|0)<8){t=z;w=w+e|0;y=y+e|0}else{break}}y=x+((q|0)<7|f)|0;w=q+1|0;if((w|0)<9){t=x;q=w;x=y;v=t}else{break}}v=8-s|0;s=0;x=b;q=b+e|0;f=n;n=b;while(1){b=c[m+(s<<2)>>2]|0;B=($(d[n+r|0]|0,b)|0)+64|0;p=s<<3;h=c[l+(p<<2)>>2]|0;g=B+($(d[f]|0,h)|0)|0;B=s+1|0;o=B<<3;t=c[l+(o<<2)>>2]|0;y=g+($(d[q]|0,t)|0)|0;g=c[m+(s+8<<2)>>2]|0;w=y+($(d[n+1|0]|0,g)|0)|0;y=w+($(d[n]|0,128-b-h-t-g|0)|0)>>7;a[x]=(y>>>31)+255&((y|0)>255?255:y);y=1;while(1){g=c[m+((y<<3)+s<<2)>>2]|0;t=($(d[n+(y+ -1)|0]|0,g)|0)+64|0;h=c[l+(y+p<<2)>>2]|0;b=t+($(d[f+y|0]|0,h)|0)|0;t=c[l+(y+o<<2)>>2]|0;w=b+($(d[q+y|0]|0,t)|0)|0;b=y+1|0;u=c[m+((b<<3)+s<<2)>>2]|0;z=w+($(d[n+b|0]|0,u)|0)|0;w=z+($(d[n+y|0]|0,128-g-h-t-u|0)|0)>>7;a[x+y|0]=(w>>>31)+255&((w|0)>255?255:w);if((b|0)<7){y=b}else{break}}y=c[m+(s+56<<2)>>2]|0;b=($(d[n+6|0]|0,y)|0)+64|0;w=c[l+((p|7)<<2)>>2]|0;u=b+($(d[f+7|0]|0,w)|0)|0;b=c[l+((o|7)<<2)>>2]|0;t=u+($(d[q+7|0]|0,b)|0)|0;u=c[m+(s+64<<2)>>2]|0;h=t+($(d[n+v|0]|0,u)|0)|0;t=h+($(d[n+7|0]|0,128-y-w-b-u|0)|0)>>7;a[x+7|0]=(t>>>31)+255&((t|0)>255?255:t);if((B|0)<8){t=q;u=n;x=x+e|0;q=q+(0-((s|0)<6|j)&e)|0;n=t;f=u;s=B}else{break}}i=k;return}function ce(b,e,f,g,h,j,k,l){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;k=k|0;l=l|0;var m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0;m=i;i=i+40|0;n=m;o=n;p=o+20|0;q=o+16|0;r=o+4|0;s=o+8|0;t=o+12|0;u=e<<1;v=o+24|0;w=o+28|0;x=o+32|0;y=o+36|0;o=0;z=b+(e*6|0)|0;A=b+(e*5|0)|0;B=b;b=f;while(1){f=d[b]|0;c[n>>2]=f;C=a[b+g|0]|0;D=C&255;c[r>>2]=D;E=g<<1;F=d[b+E|0]|0;c[s>>2]=F;G=E+g|0;E=d[b+G|0]|0;c[t>>2]=E;H=G+g|0;G=d[b+H|0]|0;c[q>>2]=G;I=H+g|0;H=d[b+I|0]|0;c[p>>2]=H;J=I+g|0;I=d[b+J|0]|0;c[v>>2]=I;K=J+g|0;J=d[b+K|0]|0;c[w>>2]=J;L=K+g|0;K=d[b+L|0]|0;c[x>>2]=K;M=d[b+(L+g)|0]|0;c[y>>2]=M;L=D-f|0;N=H-I|0;O=F-D|0;P=I-J|0;I=E-F|0;Q=J-K|0;J=G-E|0;R=((J|0)>-1?J:0-J|0)+(((I|0)>-1?I:0-I|0)+(((O|0)>-1?O:0-O|0)+((L|0)>-1?L:0-L|0)))|0;L=K-M|0;M=((L|0)>-1?L:0-L|0)+(((Q|0)>-1?Q:0-Q|0)+(((P|0)>-1?P:0-P|0)+((N|0)>-1?N:0-N|0)))|0;c[k>>2]=(c[k>>2]|0)+((R|0)<255?R:255);c[l>>2]=(c[l>>2]|0)+((M|0)<255?M:255);do{if((R|0)<(j|0)&(M|0)<(j|0)){if(!((H-G|0)<(h|0)&(G-H|0)<(h|0))){S=3;break}a[B]=(G+4+(f*3|0)+(D<<1)+F+E|0)>>>3;a[B+e|0]=((c[r>>2]|0)+4+(c[t>>2]|0)+(c[q>>2]|0)+(c[p>>2]|0)+((c[s>>2]|0)+(c[n>>2]|0)<<1)|0)>>>3;a[B+u|0]=((c[n>>2]|0)+4+(c[r>>2]|0)+(c[s>>2]|0)+(c[t>>2]<<1)+(c[q>>2]|0)+(c[p>>2]|0)+(c[v>>2]|0)|0)>>>3;N=u+e|0;a[B+N|0]=((c[r>>2]|0)+4+(c[s>>2]|0)+(c[t>>2]|0)+(c[q>>2]<<1)+(c[p>>2]|0)+(c[v>>2]|0)+(c[w>>2]|0)|0)>>>3;P=N+e|0;a[B+P|0]=((c[s>>2]|0)+4+(c[t>>2]|0)+(c[q>>2]|0)+(c[p>>2]<<1)+(c[v>>2]|0)+(c[w>>2]|0)+(c[x>>2]|0)|0)>>>3;a[B+(P+e)|0]=((c[t>>2]|0)+4+(c[q>>2]|0)+(c[p>>2]|0)+(c[v>>2]<<1)+(c[w>>2]|0)+(c[x>>2]|0)+(c[y>>2]|0)|0)>>>3;a[z]=((c[q>>2]|0)+4+(c[p>>2]|0)+(c[v>>2]|0)+(c[x>>2]|0)+((c[y>>2]|0)+(c[w>>2]|0)<<1)|0)>>>3;a[A+u|0]=((c[p>>2]|0)+4+(c[v>>2]|0)+(c[w>>2]|0)+(c[x>>2]<<1)+((c[y>>2]|0)*3|0)|0)>>>3}else{S=3}}while(0);if((S|0)==3){S=0;a[B]=C;a[B+e|0]=c[s>>2];E=e<<1;a[B+E|0]=c[t>>2];F=E+e|0;a[B+F|0]=c[q>>2];E=F+e|0;a[B+E|0]=c[p>>2];F=E+e|0;a[B+F|0]=c[v>>2];E=F+e|0;a[B+E|0]=c[w>>2];a[B+(E+e)|0]=c[x>>2]}E=o+1|0;if((E|0)<8){o=E;z=z+1|0;A=A+1|0;B=B+1|0;b=b+1|0}else{break}}i=m;return}function de(b,e,f,g,h){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0;j=i;i=i+40|0;k=j;l=k;m=h+4|0;n=l+20|0;o=l+16|0;p=l+4|0;q=l+8|0;r=l+12|0;s=l+24|0;t=l+28|0;u=l+32|0;v=l+36|0;l=1;w=b;x=b+6|0;y=b+5|0;while(1){b=d[w+ -1|0]|0;c[k>>2]=b;z=d[w]|0;c[p>>2]=z;A=d[w+1|0]|0;c[q>>2]=A;B=d[w+2|0]|0;c[r>>2]=B;C=d[w+3|0]|0;c[o>>2]=C;D=d[w+4|0]|0;c[n>>2]=D;E=d[w+5|0]|0;c[s>>2]=E;F=d[w+6|0]|0;c[t>>2]=F;G=d[w+7|0]|0;c[u>>2]=G;H=d[w+8|0]|0;c[v>>2]=H;I=z-b|0;J=D-E|0;K=A-z|0;L=E-F|0;E=B-A|0;M=F-G|0;F=C-B|0;N=((F|0)>-1?F:0-F|0)+(((E|0)>-1?E:0-E|0)+(((K|0)>-1?K:0-K|0)+((I|0)>-1?I:0-I|0)))|0;I=G-H|0;H=((I|0)>-1?I:0-I|0)+(((M|0)>-1?M:0-M|0)+(((L|0)>-1?L:0-L|0)+((J|0)>-1?J:0-J|0)))|0;c[h>>2]=(c[h>>2]|0)+((N|0)<255?N:255);c[m>>2]=(c[m>>2]|0)+((H|0)<255?H:255);do{if((N|0)<(g|0)&(H|0)<(g|0)){if(!((D-C|0)<(f|0)&(C-D|0)<(f|0))){break}a[w]=(C+4+(b*3|0)+(z<<1)+A+B|0)>>>3;a[w+1|0]=((c[p>>2]|0)+4+(c[r>>2]|0)+(c[o>>2]|0)+(c[n>>2]|0)+((c[q>>2]|0)+(c[k>>2]|0)<<1)|0)>>>3;a[w+2|0]=((c[k>>2]|0)+4+(c[p>>2]|0)+(c[q>>2]|0)+(c[r>>2]<<1)+(c[o>>2]|0)+(c[n>>2]|0)+(c[s>>2]|0)|0)>>>3;a[w+3|0]=((c[p>>2]|0)+4+(c[q>>2]|0)+(c[r>>2]|0)+(c[o>>2]<<1)+(c[n>>2]|0)+(c[s>>2]|0)+(c[t>>2]|0)|0)>>>3;a[w+4|0]=((c[q>>2]|0)+4+(c[r>>2]|0)+(c[o>>2]|0)+(c[n>>2]<<1)+(c[s>>2]|0)+(c[t>>2]|0)+(c[u>>2]|0)|0)>>>3;a[w+5|0]=((c[r>>2]|0)+4+(c[o>>2]|0)+(c[n>>2]|0)+(c[s>>2]<<1)+(c[t>>2]|0)+(c[u>>2]|0)+(c[v>>2]|0)|0)>>>3;a[x]=((c[o>>2]|0)+4+(c[n>>2]|0)+(c[s>>2]|0)+(c[u>>2]|0)+((c[v>>2]|0)+(c[t>>2]|0)<<1)|0)>>>3;a[y+2|0]=((c[n>>2]|0)+4+(c[s>>2]|0)+(c[t>>2]|0)+(c[u>>2]<<1)+((c[v>>2]|0)*3|0)|0)>>>3}}while(0);if((l|0)>=8){break}l=l+1|0;w=w+e|0;x=x+e|0;y=y+e|0}i=j;return}function ee(d,e){d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0;f=i;i=i+512|0;g=f;h=g;j=f+256|0;k=j;l=Se(d,3)|0;m=0;do{a[e+256+m|0]=Se(d,l)|0;m=m+1|0;}while((m|0)<64);m=(Se(d,4)|0)+1|0;l=0;do{b[e+128+(l<<1)>>1]=Se(d,m)|0;l=l+1|0;}while((l|0)<64);l=(Se(d,4)|0)+1|0;m=0;do{b[e+(m<<1)>>1]=Se(d,l)|0;m=m+1|0;}while((m|0)<64);m=Se(d,9)|0;l=m+1|0;n=Ye(l<<6)|0;if((n|0)==0){o=-1;i=f;return o|0}if((m|0)>-1){p=0;do{q=0;do{a[n+(p<<6)+q|0]=Se(d,8)|0;q=q+1|0;}while((q|0)<64);p=p+1|0;}while((p|0)<(l|0))}p=we(m)|0;m=0;a:while(1){q=(m|0)/3|0;r=(m|0)%3|0;s=e+320+(q*36|0)+(r*12|0)|0;do{if((m|0)>0){if((Te(d)|0)!=0){t=21;break}do{if((m|0)>2){if((Te(d)|0)==0){u=m+ -1|0;v=(u|0)%3|0;w=(u|0)/3|0;break}else{v=r;w=q+ -1|0;break}}else{u=m+ -1|0;v=(u|0)%3|0;w=(u|0)/3|0}}while(0);u=s;x=e+320+(w*36|0)+(v*12|0)|0;c[u+0>>2]=c[x+0>>2];c[u+4>>2]=c[x+4>>2];c[u+8>>2]=c[x+8>>2]}else{t=21}}while(0);b:do{if((t|0)==21){t=0;c[j>>2]=Se(d,p)|0;x=0;u=0;do{y=(Se(d,we(62-x|0)|0)|0)+1|0;c[h+(u<<2)>>2]=y;x=y+x|0;z=Se(d,p)|0;u=u+1|0;c[k+(u<<2)>>2]=z;}while((x|0)<63);if((x|0)>63){t=24;break a}c[s>>2]=u;y=u<<2;A=Ye(y)|0;c[e+320+(q*36|0)+(r*12|0)+4>>2]=A;if((A|0)==0){t=26;break a}ff(A|0,g|0,y|0)|0;y=Ye((u<<6)+64|0)|0;if((y|0)==0){t=28;break a}c[e+320+(q*36|0)+(r*12|0)+8>>2]=y;A=z;B=u;while(1){if((A|0)>=(l|0)){t=31;break a}C=y+(B<<6)+0|0;D=n+(A<<6)+0|0;E=C+64|0;do{a[C]=a[D]|0;C=C+1|0;D=D+1|0}while((C|0)<(E|0));D=B+ -1|0;if((B|0)<=0){break b}A=c[k+(D<<2)>>2]|0;B=D}}}while(0);r=m+1|0;if((r|0)<6){m=r}else{t=35;break}}if((t|0)==24){Ze(n);o=-20;i=f;return o|0}else if((t|0)==26){Ze(n);o=-1;i=f;return o|0}else if((t|0)==28){Ze(n);o=-1;i=f;return o|0}else if((t|0)==31){Ze(n);o=-20;i=f;return o|0}else if((t|0)==35){Ze(n);o=0;i=f;return o|0}return 0}function fe(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;b=i;d=5;e=6;while(1){f=(d|0)/3|0;g=(d|0)%3|0;h=(d|0)>0;do{if(h){j=e+ -2|0;k=(j|0)/3|0;l=(j|0)%3|0;j=a+320+(f*36|0)+(g*12|0)+4|0;if((c[j>>2]|0)==(c[a+320+(k*36|0)+(l*12|0)+4>>2]|0)){c[j>>2]=0}m=a+320+(f*36|0)+(g*12|0)+8|0;if((c[m>>2]|0)==(c[a+320+(k*36|0)+(l*12|0)+8>>2]|0)){c[m>>2]=0}if((d|0)<=2){n=j;o=m;break}l=a+356+(g*12|0)+4|0;if((c[l>>2]|0)==(c[a+320+(g*12|0)+4>>2]|0)){c[l>>2]=0}l=a+356+(g*12|0)+8|0;if((c[l>>2]|0)!=(c[a+320+(g*12|0)+8>>2]|0)){n=j;o=m;break}c[l>>2]=0;n=j;o=m}else{n=a+320+(f*36|0)+(g*12|0)+4|0;o=a+320+(f*36|0)+(g*12|0)+8|0}}while(0);Ze(c[n>>2]|0);Ze(c[o>>2]|0);if(h){g=d;d=d+ -1|0;e=g}else{break}}i=b;return}function ge(b,e,f,g,h,j){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;k=i;if((h|0)<=0){i=k;return}l=f<<1;m=l+f|0;n=m+f|0;o=n+f|0;p=o+f|0;q=p+f|0;r=0;do{s=c[j+(c[g+(r<<2)>>2]<<2)>>2]|0;t=e+s|0;u=t;v=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=t+4|0;t=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=b+s|0;w=u;a[w]=v;a[w+1|0]=v>>8;a[w+2|0]=v>>16;a[w+3|0]=v>>24;v=u+4|0;a[v]=t;a[v+1|0]=t>>8;a[v+2|0]=t>>16;a[v+3|0]=t>>24;t=s+f|0;v=e+t|0;u=v;w=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=v+4|0;v=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=b+t|0;t=u;a[t]=w;a[t+1|0]=w>>8;a[t+2|0]=w>>16;a[t+3|0]=w>>24;w=u+4|0;a[w]=v;a[w+1|0]=v>>8;a[w+2|0]=v>>16;a[w+3|0]=v>>24;v=s+l|0;w=e+v|0;u=w;t=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=w+4|0;w=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=b+v|0;v=u;a[v]=t;a[v+1|0]=t>>8;a[v+2|0]=t>>16;a[v+3|0]=t>>24;t=u+4|0;a[t]=w;a[t+1|0]=w>>8;a[t+2|0]=w>>16;a[t+3|0]=w>>24;w=s+m|0;t=e+w|0;u=t;v=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=t+4|0;t=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=b+w|0;w=u;a[w]=v;a[w+1|0]=v>>8;a[w+2|0]=v>>16;a[w+3|0]=v>>24;v=u+4|0;a[v]=t;a[v+1|0]=t>>8;a[v+2|0]=t>>16;a[v+3|0]=t>>24;t=s+n|0;v=e+t|0;u=v;w=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=v+4|0;v=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=b+t|0;t=u;a[t]=w;a[t+1|0]=w>>8;a[t+2|0]=w>>16;a[t+3|0]=w>>24;w=u+4|0;a[w]=v;a[w+1|0]=v>>8;a[w+2|0]=v>>16;a[w+3|0]=v>>24;v=s+o|0;w=e+v|0;u=w;t=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=w+4|0;w=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=b+v|0;v=u;a[v]=t;a[v+1|0]=t>>8;a[v+2|0]=t>>16;a[v+3|0]=t>>24;t=u+4|0;a[t]=w;a[t+1|0]=w>>8;a[t+2|0]=w>>16;a[t+3|0]=w>>24;w=s+p|0;t=e+w|0;u=t;v=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=t+4|0;t=d[u]|d[u+1|0]<<8|d[u+2|0]<<16|d[u+3|0]<<24;u=b+w|0;w=u;a[w]=v;a[w+1|0]=v>>8;a[w+2|0]=v>>16;a[w+3|0]=v>>24;v=u+4|0;a[v]=t;a[v+1|0]=t>>8;a[v+2|0]=t>>16;a[v+3|0]=t>>24;t=s+q|0;s=e+t|0;v=s;u=d[v]|d[v+1|0]<<8|d[v+2|0]<<16|d[v+3|0]<<24;v=s+4|0;s=d[v]|d[v+1|0]<<8|d[v+2|0]<<16|d[v+3|0]<<24;v=b+t|0;t=v;a[t]=u;a[t+1|0]=u>>8;a[t+2|0]=u>>16;a[t+3|0]=u>>24;u=v+4|0;a[u]=s;a[u+1|0]=s>>8;a[u+2|0]=s>>16;a[u+3|0]=s>>24;r=r+1|0;}while((r|0)<(h|0));i=k;return}function he(c,d,e){c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0;f=i;g=c;c=0;while(1){h=c<<3;j=(b[e+(h<<1)>>1]|0)+128|0;a[g]=(j>>>31)+255&((j|0)>255?255:j);j=(b[e+((h|1)<<1)>>1]|0)+128|0;a[g+1|0]=(j>>>31)+255&((j|0)>255?255:j);j=(b[e+((h|2)<<1)>>1]|0)+128|0;a[g+2|0]=(j>>>31)+255&((j|0)>255?255:j);j=(b[e+((h|3)<<1)>>1]|0)+128|0;a[g+3|0]=(j>>>31)+255&((j|0)>255?255:j);j=(b[e+((h|4)<<1)>>1]|0)+128|0;a[g+4|0]=(j>>>31)+255&((j|0)>255?255:j);j=(b[e+((h|5)<<1)>>1]|0)+128|0;a[g+5|0]=(j>>>31)+255&((j|0)>255?255:j);j=(b[e+((h|6)<<1)>>1]|0)+128|0;a[g+6|0]=(j>>>31)+255&((j|0)>255?255:j);j=(b[e+((h|7)<<1)>>1]|0)+128|0;a[g+7|0]=(j>>>31)+255&((j|0)>255?255:j);j=c+1|0;if((j|0)<8){c=j;g=g+d|0}else{break}}i=f;return}function ie(c,e,f,g){c=c|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0;h=i;j=e;e=c;c=0;while(1){k=c<<3;l=0;do{m=(d[j+l|0]|0)+(b[g+(l+k<<1)>>1]|0)|0;a[e+l|0]=(m>>>31)+255&((m|0)>255?255:m);l=l+1|0;}while((l|0)<8);l=c+1|0;if((l|0)<8){j=j+f|0;e=e+f|0;c=l}else{break}}i=h;return}function je(c,e,f,g,h){c=c|0;e=e|0;f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0;j=i;k=e;e=f;f=c;c=0;while(1){l=c<<3;m=0;do{n=(((d[e+m|0]|0)+(d[k+m|0]|0)|0)>>>1)+(b[h+(m+l<<1)>>1]|0)|0;a[f+m|0]=(n>>>31)+255&((n|0)>255?255:n);m=m+1|0;}while((m|0)<8);m=c+1|0;if((m|0)<8){k=k+g|0;e=e+g|0;f=f+g|0;c=m}else{break}}i=j;return}function ke(b,c){b=b|0;c=c|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;e=i;f=0;g=0;h=0;j=0;a:while(1){k=g;while(1){l=Te(b)|0;if((Ue(b)|0)<0){m=-20;n=16;break a}if((l|0)!=0){break}if((k|0)>31){m=-20;n=16;break a}else{k=k+1|0}}l=h+1|0;if((h|0)>31){m=-20;n=16;break}o=Se(b,5)|0;p=d[63048+o|0]|0;q=1<<p;if((q|0)>0){r=p+k&255;p=q;s=j;t=d[63080+o|0]|0;while(1){o=p+ -1|0;a[c+(s<<1)|0]=t;a[c+(s<<1)+1|0]=r;if((o|0)>0){t=t+1|0;s=s+1|0;p=o}else{break}}u=j+q|0}else{u=j}if((k|0)<=0){m=u;n=16;break}p=f;s=-2147483648>>>(k+ -1|0);t=k;while(1){if((s&p|0)==0){break}r=t+ -1|0;if((r|0)>0){p=s^p;s=s<<1;t=r}else{m=u;n=16;break a}}f=s|p;g=t;h=l;j=u}if((n|0)==16){i=e;return m|0}return 0}function le(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;i=i+512|0;e=d;f=0;while(1){g=ke(a,e)|0;if((g|0)<0){h=g;j=6;break}k=me(0,e,g)|0;if(k>>>0>32767){h=-23;j=6;break}l=Ye(k<<1)|0;if((l|0)==0){h=-1;j=6;break}me(l,e,g)|0;c[b+(f<<2)>>2]=l;l=f+1|0;if((l|0)<80){f=l}else{h=0;j=6;break}}if((j|0)==6){i=d;return h|0}return 0}function me(c,e,f){c=c|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0;g=i;i=i+152|0;h=g;j=g+72|0;k=j;l=g+112|0;m=l;a[j]=0;j=f+255&255;a[l]=j;l=(c|0)!=0;f=0;n=j;j=0;o=0;p=0;while(1){q=1-p+(n&255)|0;r=f&255;s=f<<24>>24!=0?2:7;a:do{if((q|0)>0){t=0;u=1;v=1;w=2;while(1){x=(u|0)==0;y=v+1|0;z=y+r|0;A=0;B=0;C=0;while(1){D=C+p|0;E=e+(D<<1)|0;F=d[e+(D<<1)+1|0]|0;do{if((F|0)<(z|0)){G=A;H=C+1|0}else{if((F|0)==(z|0)){G=1;H=C+1|0;break}else{G=A;H=(re(E,z)|0)+C|0;break}}}while(0);I=B+1|0;if((H|0)<(q|0)){A=G;B=I;C=H}else{break}}C=x?t:v;if((B|0)<(w|0)){J=C;break a}if(($(I,s)|0)<(1<<y|0)){J=C;break}else{t=C;u=G;w=I;v=y}}}else{J=1}}while(0);s=o&65535;q=h+(j<<1)|0;b[q>>1]=s;K=o+1+(1<<J)|0;if(l){b[q>>1]=s+1<<16>>16;b[c+(s<<16>>16<<1)>>1]=J;L=f;M=n;N=j;O=J;P=p}else{L=f;M=n;N=j;O=J;P=p}while(1){s=M&255;b:do{if((P|0)>(s|0)){Q=P}else{q=L&255;r=q+O|0;v=h+(N<<1)|0;if(l){R=P}else{w=P;while(1){if((d[e+(w<<1)+1|0]|0|0)>(r|0)){Q=w;break b}u=w+1|0;if((w|0)<(s|0)){w=u}else{Q=u;break b}}}while(1){w=d[e+(R<<1)+1|0]|0;if((w|0)>(r|0)){Q=R;break b}y=1<<r-w;B=0-(d[e+(R<<1)|0]|0|w-q<<8)&65535;if((y|0)>0){w=b[v>>1]|0;x=y+65535&65535;u=w;t=y;while(1){y=t+ -1|0;b[c+(u<<16>>16<<1)>>1]=B;if((y|0)>0){t=y;u=u+1<<16>>16}else{break}}b[v>>1]=(w+1<<16>>16)+x<<16>>16}u=R+1|0;if((R|0)<(s|0)){R=u}else{Q=u;break}}}}while(0);if((Q|0)<=(s|0)){S=25;break}v=N+ -1|0;if((N|0)<=0){T=v;break}q=a[k+v|0]|0;r=(L&255)-(q&255)|0;L=q;M=a[m+v|0]|0;N=v;O=r;P=Q}if((S|0)==25){S=0;r=(L&255)+O|0;v=N+1|0;a[k+v|0]=r;if(l){q=h+(N<<1)|0;u=b[q>>1]|0;b[q>>1]=u+1<<16>>16;b[c+(u<<16>>16<<1)>>1]=K}a[m+v|0]=Q+255+(re(e+(Q<<1)|0,r&255)|0);T=v}if(!((T|0)>-1)){break}f=a[k+T|0]|0;n=a[m+T|0]|0;j=T;o=K;p=Q}i=g;return K|0}function ne(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0;d=i;e=0;while(1){f=b+(e<<2)|0;g=(oe(c[f>>2]|0,0)|0)<<1;h=Ye(g)|0;c[a+(e<<2)>>2]=h;if((h|0)==0){break}ff(h|0,c[f>>2]|0,g|0)|0;g=e+1|0;if((g|0)<80){e=g}else{j=0;k=6;break}}if((k|0)==6){i=d;return j|0}if((e|0)>0){l=e}else{j=-1;i=d;return j|0}while(1){e=l+ -1|0;Ze(c[a+(e<<2)>>2]|0);if((e|0)>0){l=e}else{j=-1;break}}i=d;return j|0}function oe(a,c){a=a|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;d=i;e=b[a+(c<<1)>>1]|0;f=1<<e;g=c+1|0;c=0;h=f+1|0;while(1){j=b[a+(g+c<<1)>>1]|0;k=j<<16>>16;if(j<<16>>16<1){l=1<<e-(0-k>>8);m=h}else{l=1;m=(oe(a,k)|0)+h|0}k=l+c|0;if((k|0)<(f|0)){c=k;h=m}else{break}}i=d;return m|0}function pe(a){a=a|0;var b=0,d=0;b=i;d=0;do{Ze(c[a+(d<<2)>>2]|0);d=d+1|0;}while((d|0)<80);i=b;return}function qe(a,e){a=a|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;f=i;g=a+4|0;h=a+8|0;j=c[a>>2]|0;k=a+12|0;a=c[k>>2]|0;l=0;m=c[g>>2]|0;n=c[h>>2]|0;while(1){o=b[e+(l<<1)>>1]|0;if((o|0)>(a|0)){p=m;q=32-a|0;r=n;while(1){if(!(p>>>0<j>>>0)){s=p;t=-1073741824;u=r;break}v=q+ -8|0;w=p+1|0;x=d[p]<<v|r;if(v>>>0>7){p=w;q=v;r=x}else{s=w;t=v;u=x;break}}y=32-t|0;z=s;A=u}else{y=a;z=m;A=n}r=b[e+(l+1+(A>>>(32-o|0))<<1)>>1]|0;B=r<<16>>16;if(r<<16>>16<1){break}a=y-o|0;l=B;m=z;n=A<<o}n=0-B|0;B=n>>8;c[g>>2]=z;c[h>>2]=A<<B;c[k>>2]=y-B;i=f;return n&255|0}function re(a,b){a=a|0;b=b|0;var c=0,e=0,f=0,g=0,h=0,j=0,k=0;c=i;e=b+31|0;f=0;g=0;while(1){h=(d[a+(g<<1)+1|0]|0)-b|0;if((h|0)<32){j=-2147483648>>>h;k=g+1|0}else{j=1;k=(re(a+(g<<1)|0,e)|0)+g|0}h=j+f|0;if((h|0)>-1){f=h;g=k}else{break}}i=c;return k|0}function se(b){b=b|0;var d=0,e=0,f=0;d=i;e=b+0|0;f=e+60|0;do{c[e>>2]=0;e=e+4|0}while((e|0)<(f|0));a[b]=3;a[b+1|0]=2;a[b+2|0]=1;c[b+60>>2]=6;i=d;return}function te(a){a=a|0;var b=0,d=0;b=i;d=a+0|0;a=d+64|0;do{c[d>>2]=0;d=d+4|0}while((d|0)<(a|0));i=b;return}function ue(a){a=a|0;var b=0,d=0;b=i;d=a;c[d+0>>2]=0;c[d+4>>2]=0;c[d+8>>2]=0;c[d+12>>2]=0;i=b;return}function ve(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0;b=i;if((a|0)==0){i=b;return}d=a+8|0;e=c[a>>2]|0;if((c[d>>2]|0)>0){f=e;g=0;while(1){Ze(c[f+(g<<2)>>2]|0);h=g+1|0;j=c[a>>2]|0;if((h|0)<(c[d>>2]|0)){g=h;f=j}else{k=j;break}}}else{k=e}Ze(k);Ze(c[a+4>>2]|0);Ze(c[a+12>>2]|0);k=a;c[k+0>>2]=0;c[k+4>>2]=0;c[k+8>>2]=0;c[k+12>>2]=0;i=b;return}function we(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;b=i;if((a|0)==0){c=0}else{d=a;a=0;while(1){e=d>>>1;f=a+1|0;if((e|0)==0){c=f;break}else{a=f;d=e}}}i=b;return c|0}function xe(b,c){b=b|0;c=c|0;var d=0,e=0,f=0,g=0;d=i;e=c+ -1|0;if((e&c|0)!=0|e>>>0>255|b>>>0>~c>>>0){f=0;i=d;return f|0}g=Ye(c+b|0)|0;if((g|0)==0){f=0;i=d;return f|0}b=g+ -1&e;a[g+b|0]=b;f=g+(b+1)|0;i=d;return f|0}function ye(a){a=a|0;var b=0;b=i;if((a|0)==0){i=b;return}Ze(a+~(d[a+ -1|0]|0)|0);i=b;return}function ze(a,b){a=a|0;b=b|0;var d=0,e=0;c[a>>2]=c[b>>2];d=c[b+4>>2]|0;c[a+4>>2]=d;e=0-(c[b+8>>2]|0)|0;c[a+8>>2]=e;c[a+12>>2]=(c[b+12>>2]|0)+($(1-d|0,e)|0);c[a+16>>2]=c[b+16>>2];e=c[b+20>>2]|0;c[a+20>>2]=e;d=0-(c[b+24>>2]|0)|0;c[a+24>>2]=d;c[a+28>>2]=(c[b+28>>2]|0)+($(1-e|0,d)|0);c[a+32>>2]=c[b+32>>2];d=c[b+36>>2]|0;c[a+36>>2]=d;e=0-(c[b+40>>2]|0)|0;c[a+40>>2]=e;c[a+44>>2]=(c[b+44>>2]|0)+($(1-d|0,e)|0);i=i;return}function Ae(f,g,h){f=f|0;g=g|0;h=h|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0;j=i;i=i+64|0;k=j;l=k;m=(g|0)==0;n=0;while(1){o=63304+(n<<2)|0;p=63312+(n<<2)|0;q=0;while(1){r=h+320+(n*36|0)+(q*12|0)|0;s=c[r>>2]|0;if((s|0)>=0){t=h+320+(n*36|0)+(q*12|0)+8|0;u=c[o>>2]|0;v=c[p>>2]|0;w=h+320+(n*36|0)+(q*12|0)+4|0;x=s;s=0;y=0;while(1){z=k+0|0;A=(c[t>>2]|0)+(y<<6)+0|0;B=z+64|0;do{a[z]=a[A]|0;z=z+1|0;A=A+1|0}while((z|0)<(B|0));if((y|0)==(x|0)){C=s+1|0}else{C=(c[(c[w>>2]|0)+(y<<2)>>2]|0)+s|0}A=y+1|0;a:do{if(m){z=s;b:while(1){B=((($(d[k]|0,e[h+(z<<1)>>1]|0)|0)>>>0)/100|0)<<2;D=B>>>0>4096?4096:B;B=f+(z*24|0)+(q<<3)+(n<<2)|0;E=c[B>>2]|0;b[E>>1]=u-(D>>>0>u>>>0?u-D|0:0);D=h+128+(z<<1)|0;F=1;while(1){G=((($(d[l+(d[63112+F|0]|0)|0]|0,e[D>>1]|0)|0)>>>0)/100|0)<<2;H=G>>>0>4096?4096:G;b[E+(F<<1)>>1]=v-(H>>>0>v>>>0?v-H|0:0);H=F+1|0;if((H|0)<64){F=H}else{I=0;break}}c:while(1){F=(I|0)<(n|0);D=F?3:q;if((D|0)>0){H=0;do{J=c[f+(z*24|0)+(H<<3)+(I<<2)>>2]|0;H=H+1|0;if((df(E,J,128)|0)==0){K=13;break c}}while((H|0)<(D|0))}if(F){I=I+1|0}else{break}}if((K|0)==13){K=0;c[B>>2]=J}E=z+1|0;if((E|0)>=(C|0)){L=x;M=E;break a}D=C-E|0;H=c[t>>2]|0;G=E-s|0;N=c[(c[w>>2]|0)+(y<<2)>>2]|0;O=N<<1;P=0;while(1){Q=$(d[H+(y<<6)+P|0]|0,D)|0;a[l+P|0]=((($(d[H+(A<<6)+P|0]|0,G)|0)+Q<<1)+N|0)/(O|0)|0;Q=P+1|0;if((Q|0)<64){P=Q}else{z=E;continue b}}}}else{z=s;d:while(1){E=$(d[k]|0,e[h+(z<<1)>>1]|0)|0;c[g+(z<<2)>>2]=(E>>>0)/160|0;P=((E>>>0)/100|0)<<2;E=P>>>0>4096?4096:P;P=f+(z*24|0)+(q<<3)+(n<<2)|0;O=c[P>>2]|0;b[O>>1]=u-(E>>>0>u>>>0?u-E|0:0);E=h+128+(z<<1)|0;N=1;while(1){G=((($(d[l+(d[63112+N|0]|0)|0]|0,e[E>>1]|0)|0)>>>0)/100|0)<<2;H=G>>>0>4096?4096:G;b[O+(N<<1)>>1]=v-(H>>>0>v>>>0?v-H|0:0);H=N+1|0;if((H|0)<64){N=H}else{R=0;break}}e:while(1){N=(R|0)<(n|0);E=N?3:q;if((E|0)>0){H=0;do{S=c[f+(z*24|0)+(H<<3)+(R<<2)>>2]|0;H=H+1|0;if((df(O,S,128)|0)==0){K=27;break e}}while((H|0)<(E|0))}if(N){R=R+1|0}else{break}}if((K|0)==27){K=0;c[P>>2]=S}T=z+1|0;if((T|0)>=(C|0)){break}O=C-T|0;E=c[t>>2]|0;H=T-s|0;F=c[(c[w>>2]|0)+(y<<2)>>2]|0;G=F<<1;D=0;while(1){B=$(d[E+(y<<6)+D|0]|0,O)|0;a[l+D|0]=((($(d[E+(A<<6)+D|0]|0,H)|0)+B<<1)+F|0)/(G|0)|0;B=D+1|0;if((B|0)<64){D=B}else{z=T;continue d}}}L=c[r>>2]|0;M=T}}while(0);if((y|0)<(L|0)){x=L;s=M;y=A}else{break}}}q=q+1|0;if((q|0)>=3){break}}n=n+1|0;if((n|0)>=2){break}}i=j;return}function Be(a,c){a=a|0;c=c|0;var d=0,e=0,f=0,g=0,h=0;d=b[c>>1]|0;e=b[c+2>>1]|0;f=b[c+4>>1]|0;g=b[c+6>>1]|0;c=((e&255)<<24>>24)+((d&255)<<24>>24)+((f&255)<<24>>24)+((g&255)<<24>>24)|0;h=(e<<16>>16>>8)+(d<<16>>16>>8)+(f<<16>>16>>8)+(g<<16>>16>>8)|0;b[a>>1]=(c+2+(c>>31)|0)>>>2&255|(h+2+(h>>31)|0)>>>2<<8;i=i;return}function Ce(a,c){a=a|0;c=c|0;var d=0,e=0,f=0,g=0;d=b[c>>1]|0;e=b[c+4>>1]|0;f=((e&255)<<24>>24)+((d&255)<<24>>24)|0;g=(e<<16>>16>>8)+(d<<16>>16>>8)|0;b[a>>1]=(f+1+(f>>31)|0)>>>1&255|(g+1+(g>>31)|0)>>>1<<8;g=b[c+2>>1]|0;f=b[c+6>>1]|0;c=((f&255)<<24>>24)+((g&255)<<24>>24)|0;d=(f<<16>>16>>8)+(g<<16>>16>>8)|0;b[a+2>>1]=(c+1+(c>>31)|0)>>>1&255|(d+1+(d>>31)|0)>>>1<<8;i=i;return}function De(a,c){a=a|0;c=c|0;var d=0,e=0,f=0,g=0;d=b[c>>1]|0;e=b[c+2>>1]|0;f=((e&255)<<24>>24)+((d&255)<<24>>24)|0;g=(e<<16>>16>>8)+(d<<16>>16>>8)|0;b[a>>1]=(f+1+(f>>31)|0)>>>1&255|(g+1+(g>>31)|0)>>>1<<8;g=b[c+4>>1]|0;f=b[c+6>>1]|0;c=((f&255)<<24>>24)+((g&255)<<24>>24)|0;d=(f<<16>>16>>8)+(g<<16>>16>>8)|0;b[a+4>>1]=(c+1+(c>>31)|0)>>>1&255|(d+1+(d>>31)|0)>>>1<<8;i=i;return}function Ee(a,c){a=a|0;c=c|0;b[a>>1]=b[c>>1]|0;b[a+2>>1]=b[c+2>>1]|0;b[a+4>>1]=b[c+4>>1]|0;b[a+6>>1]=b[c+6>>1]|0;i=i;return}function Fe(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0,Pa=0,Qa=0,Ra=0,Sa=0,Ta=0,Ua=0,Va=0,Wa=0,Xa=0,Ya=0,Za=0,_a=0,$a=0,ab=0,bb=0,cb=0,db=0,eb=0,fb=0,gb=0,hb=0,ib=0,jb=0,kb=0,mb=0,nb=0,ob=0,pb=0,qb=0,rb=0,sb=0,tb=0,ub=0,vb=0,wb=0,xb=0,yb=0,zb=0,Ab=0,Bb=0,Cb=0;g=i;if((e|0)==0){h=-1;i=g;return h|0}j=c[e+4>>2]|0;if((j&15|0)!=0){h=-10;i=g;return h|0}k=e+8|0;l=c[k>>2]|0;if((l&15|0)!=0|(j|0)==0|j>>>0>1048575|(l|0)==0|l>>>0>1048575){h=-10;i=g;return h|0}m=c[e+20>>2]|0;if(((c[e+12>>2]|0)+m|0)>>>0>j>>>0){h=-10;i=g;return h|0}j=e+24|0;n=c[j>>2]|0;o=e+16|0;p=c[o>>2]|0;if((p+n|0)>>>0>l>>>0|m>>>0>255){h=-10;i=g;return h|0}if((l-n-p|0)>>>0>255){h=-10;i=g;return h|0}if((c[e+44>>2]|0)>>>0>2){h=-10;i=g;return h|0}if((c[e+48>>2]|0)>>>0>3){h=-10;i=g;return h|0}if((c[e+28>>2]|0)==0){h=-10;i=g;return h|0}if((c[e+32>>2]|0)==0){h=-10;i=g;return h|0}hf(b|0,0,51632)|0;p=b+0|0;n=e+0|0;l=p+64|0;do{c[p>>2]=c[n>>2];p=p+4|0;n=n+4|0}while((p|0)<(l|0));m=b+24|0;c[m>>2]=(c[k>>2]|0)-(c[o>>2]|0)-(c[j>>2]|0);a[b+872|0]=-1;c[b+68>>2]=0;c[b+64>>2]=63112;j=b+4|0;o=(c[j>>2]|0)>>>3;k=b+8|0;q=(c[k>>2]|0)>>>3;r=b+48|0;s=c[r>>2]|0;t=s&1^1;u=s>>>1&1^1;s=(t+o|0)>>>t;t=(u+q|0)>>>u;u=$(q,o)|0;v=$(t,s)|0;w=v<<1;x=w+u|0;y=(o+3|0)>>>2;z=(q+3|0)>>>2;A=s+3>>2;B=t+3>>2;C=$(z,y)|0;E=$(B,A)|0;F=E<<1;G=F+C|0;H=C<<2;do{if((w|0)<(v|0)|(v|0)<0){I=-23}else{if(!((C&1073741823|0)==(C|0)&((((C>>>0)/(y>>>0)|0|0)!=(z|0)|F>>>0<E>>>0|G>>>0<C>>>0)^1))){I=-23;break}J=b+72|0;c[J>>2]=o;K=b+76|0;c[K>>2]=q;L=b+80|0;c[L>>2]=0;M=b+84|0;c[M>>2]=u;c[b+88>>2]=y;c[b+92>>2]=z;c[b+96>>2]=0;c[b+100>>2]=C;N=b+136|0;c[N>>2]=s;O=b+104|0;c[O>>2]=s;c[b+140>>2]=t;c[b+108>>2]=t;P=b+112|0;c[P>>2]=u;Q=b+144|0;c[Q>>2]=v+u;R=b+148|0;c[R>>2]=v;S=b+116|0;c[S>>2]=v;c[b+152>>2]=A;c[b+120>>2]=A;c[b+156>>2]=B;c[b+124>>2]=B;c[b+128>>2]=C;c[b+160>>2]=E+C;c[b+164>>2]=E;c[b+132>>2]=E;T=b+180|0;c[T>>2]=x;U=_e(x,4)|0;V=b+168|0;c[V>>2]=U;W=Ye(x<<1)|0;c[b+176>>2]=W;c[b+192>>2]=G;X=Ye(G<<6)|0;Y=b+184|0;c[Y>>2]=X;Z=_e(G,1)|0;_=b+188|0;c[_>>2]=Z;c[b+204>>2]=y<<1;c[b+208>>2]=z<<1;c[b+212>>2]=H;aa=_e(H,48)|0;ba=b+196|0;c[ba>>2]=aa;ca=_e(H,1)|0;da=b+200|0;c[da>>2]=ca;ea=Ye(x<<2)|0;c[b+216>>2]=ea;if((U|0)==0|(W|0)==0|(X|0)==0|(Z|0)==0|(aa|0)==0){I=-1;break}if((ca|0)==0|(ea|0)==0){I=-1;break}else{fa=X;ga=q;ha=0;ia=Z;ja=0;ka=0}while(1){Z=c[b+72+(ka<<5)>>2]|0;X=Z<<2;ea=0;ca=0;aa=ha;while(1){W=ga-ca|0;if((W|0)>4){la=4}else{if((W|0)<1){break}else{la=W}}W=ea;U=0;while(1){ma=Z-U|0;if((ma|0)>4){na=4}else{if((ma|0)<1){break}else{na=ma}}ma=W+ja|0;p=fa+(ma<<6)+0|0;l=p+64|0;do{c[p>>2]=-1;p=p+4|0}while((p|0)<(l|0));oa=0;pa=U+aa|0;while(1){qa=0;do{c[fa+(ma<<6)+(c[63608+(oa<<5)+(qa<<3)>>2]<<4)+(c[63608+(oa<<5)+(qa<<3)+4>>2]<<2)>>2]=qa+pa;qa=qa+1|0;}while((qa|0)<(na|0));qa=oa+1|0;if((qa|0)<(la|0)){oa=qa;pa=pa+Z|0}else{break}}pa=ia+ma|0;oa=a[pa]|0;qa=oa&-61;ra=(((oa&255)>>>2&255|(c[fa+(ma<<6)>>2]|0)>>>31^1)&255)<<2&60|qa;a[pa]=ra;oa=(((ra&255)>>>2&255|(c[fa+(ma<<6)+16>>2]|0)>>>31<<1^2)&255)<<2&60|qa;a[pa]=oa;ra=(((oa&255)>>>2&255|(c[fa+(ma<<6)+32>>2]|0)>>>31<<2^4)&255)<<2&60|qa;a[pa]=ra;a[pa]=(((ra&255)>>>2&255|(c[fa+(ma<<6)+56>>2]|0)>>>31<<3^8)&255)<<2&60|qa;W=W+1|0;U=U+4|0}ea=W;ca=ca+4|0;aa=aa+X|0}X=ka+1|0;if((X|0)>=3){break}fa=c[Y>>2]|0;ga=c[b+72+(X<<5)+4>>2]|0;ha=c[b+72+(X<<5)+8>>2]|0;ia=c[_>>2]|0;ja=c[b+72+(X<<5)+24>>2]|0;ka=X}_=c[ba>>2]|0;Y=c[da>>2]|0;X=c[63592+(c[r>>2]<<2)>>2]|0;aa=c[K>>2]|0;if((aa|0)>0){ca=aa;aa=c[J>>2]|0;ea=0;Z=0;while(1){if((aa|0)>0){U=ea;qa=0;do{ra=U<<2;pa=qa|1;oa=qa|2;sa=qa|3;ta=0;do{ua=ta<<1|Z;va=ua|1;wa=d[63240+(ta<<1)|0]|ra;xa=_+(wa*48|0)|0;p=xa+0|0;l=p+48|0;do{c[p>>2]=-1;p=p+4|0}while((p|0)<(l|0));ma=c[J>>2]|0;do{if((qa|0)<(ma|0)){if((ua|0)>=(c[K>>2]|0)){ya=35;break}c[xa>>2]=($(ma,ua)|0)+qa;c[_+(wa*48|0)+4>>2]=($(c[J>>2]|0,ua)|0)+pa;c[_+(wa*48|0)+8>>2]=($(c[J>>2]|0,va)|0)+qa;c[_+(wa*48|0)+12>>2]=($(c[J>>2]|0,va)|0)+pa;lb[X&7](xa,J,qa,ua)}else{ya=35}}while(0);if((ya|0)==35){ya=0;a[Y+wa|0]=-1}xa=d[63241+(ta<<1)|0]|ra;ma=_+(xa*48|0)|0;p=ma+0|0;l=p+48|0;do{c[p>>2]=-1;p=p+4|0}while((p|0)<(l|0));wa=c[J>>2]|0;do{if((oa|0)<(wa|0)){if((ua|0)>=(c[K>>2]|0)){ya=42;break}c[ma>>2]=($(wa,ua)|0)+oa;c[_+(xa*48|0)+4>>2]=($(c[J>>2]|0,ua)|0)+sa;c[_+(xa*48|0)+8>>2]=($(c[J>>2]|0,va)|0)+oa;c[_+(xa*48|0)+12>>2]=($(c[J>>2]|0,va)|0)+sa;lb[X&7](ma,J,oa,ua)}else{ya=42}}while(0);if((ya|0)==42){ya=0;a[Y+xa|0]=-1}ta=ta+1|0;}while((ta|0)<2);qa=qa+4|0;U=U+1|0;za=c[J>>2]|0;}while((qa|0)<(za|0));Aa=c[K>>2]|0;Ba=za;Ca=U}else{Aa=ca;Ba=aa;Ca=ea}qa=Z+4|0;if((qa|0)<(Aa|0)){ca=Aa;aa=Ba;ea=Ca;Z=qa}else{break}}}Z=b+588|0;c[Z>>2]=0;ea=c[V>>2]|0;aa=b+20|0;ca=b+12|0;K=b+16|0;J=ea;Y=0;X=ea;while(1){ea=c[aa>>2]|0;_=(c[ca>>2]|0)+ea|0;da=c[m>>2]|0;ba=(c[K>>2]|0)+da|0;do{if((Y|0)>0){qa=c[r>>2]|0;if((qa&1|0)==0){Da=ea>>1;Ea=_+1>>1}else{Da=ea;Ea=_}if((qa&2|0)!=0){Fa=Da;Ga=Ea;Ha=da;Ia=ba;break}Fa=Da;Ga=Ea;Ha=da>>1;Ia=ba+1>>1}else{Fa=ea;Ga=_;Ha=da;Ia=ba}}while(0);ba=X+(c[b+72+(Y<<5)+12>>2]<<2)|0;if(J>>>0<ba>>>0){da=b+72+(Y<<5)|0;_=(Fa|0)<(Ga|0);ea=(Ha|0)<(Ia|0);U=J;qa=0;while(1){ta=c[da>>2]|0;oa=U+(ta<<2)|0;sa=qa+8|0;if((ta|0)>0){ta=(sa|0)>(Ha|0);ra=(Ia|0)>(qa|0);pa=(qa|0)<(Ha|0)&ta;W=ra&(Ia|0)<(sa|0);ua=ta&ra&_&ea^1;ra=U;ta=0;while(1){ma=ta+8|0;do{if((Ga|0)<=(ta|0)|(ma|0)<=(Fa|0)|ua){c[ra>>2]=c[ra>>2]|2}else{va=(ta|0)<(Fa|0);if(!(va|(Ga|0)<(ma|0)|pa|W)){c[ra>>2]=c[ra>>2]|63488;break}wa=ta|1;Ja=(wa|0)>=(Ga|0)|(wa|0)<(Fa|0);wa=ta|2;Ka=(wa|0)>=(Ga|0)|(wa|0)<(Fa|0);wa=ta|3;La=(wa|0)>=(Ga|0)|(wa|0)<(Fa|0);wa=ta|4;Ma=(wa|0)>=(Ga|0)|(wa|0)<(Fa|0);wa=ta|5;Na=(wa|0)>=(Ga|0)|(wa|0)<(Fa|0);wa=ta|6;Oa=(wa|0)>=(Ga|0)|(wa|0)<(Fa|0);wa=ta|7;Pa=(wa|0)>=(Ga|0)|(wa|0)<(Fa|0);wa=0;Qa=0;Ra=0;Sa=0;while(1){Ta=Ra+qa|0;Ua=Ra<<3;Va=(Ta|0)>=(Ia|0)|(Ta|0)<(Ha|0);if(va|Va){Wa=wa;Xa=Qa;Ya=Sa}else{Ta=jf(1,0,Ua|0)|0;Wa=Ta|wa;Xa=D|Qa;Ya=Sa+1|0}if(Ja|Va){Za=Wa;_a=Xa;$a=Ya}else{Ta=jf(1,0,Ua|1|0)|0;Za=Wa|Ta;_a=Xa|D;$a=Ya+1|0}if(Ka|Va){ab=Za;bb=_a;cb=$a}else{Ta=jf(1,0,Ua|2|0)|0;ab=Za|Ta;bb=_a|D;cb=$a+1|0}if(La|Va){db=ab;eb=bb;fb=cb}else{Ta=jf(1,0,Ua|3|0)|0;db=ab|Ta;eb=bb|D;fb=cb+1|0}if(Ma|Va){gb=db;hb=eb;ib=fb}else{Ta=jf(1,0,Ua|4|0)|0;gb=db|Ta;hb=eb|D;ib=fb+1|0}if(Na|Va){jb=gb;kb=hb;mb=ib}else{Ta=jf(1,0,Ua|5|0)|0;jb=gb|Ta;kb=hb|D;mb=ib+1|0}if(Oa|Va){nb=jb;ob=kb;pb=mb}else{Ta=jf(1,0,Ua|6|0)|0;nb=jb|Ta;ob=kb|D;pb=mb+1|0}if(Pa|Va){qb=nb;rb=ob;sb=pb}else{Va=jf(1,0,Ua|7|0)|0;qb=nb|Va;rb=ob|D;sb=pb+1|0}Va=Ra+1|0;if((Va|0)<8){wa=qb;Qa=rb;Ra=Va;Sa=sb}else{break}}Sa=c[Z>>2]|0;a:do{if((Sa|0)>0){Ra=0;while(1){Qa=b+592+(Ra<<4)|0;wa=Ra+1|0;if((c[Qa>>2]|0)==(qb|0)&(c[Qa+4>>2]|0)==(rb|0)){tb=Ra;break a}if((wa|0)<(Sa|0)){Ra=wa}else{ub=wa;ya=64;break}}}else{ub=0;ya=64}}while(0);if((ya|0)==64){ya=0;c[Z>>2]=Sa+1;Ra=b+592+(ub<<4)|0;c[Ra>>2]=qb;c[Ra+4>>2]=rb;c[b+592+(ub<<4)+8>>2]=sb;tb=ub}c[ra>>2]=c[ra>>2]&-63489|tb<<11&63488}}while(0);xa=ra+4|0;if(xa>>>0<oa>>>0){ra=xa;ta=ma}else{vb=xa;break}}}else{vb=U}if(vb>>>0<ba>>>0){U=vb;qa=sa}else{wb=vb;break}}}else{wb=J}qa=Y+1|0;if((qa|0)<3){J=wb;Y=qa;X=ba}else{break}}if((f+ -3|0)>>>0>3){I=-10;break}X=c[r>>2]|0;Y=X&1^1;J=X>>>1&1^1;X=c[j>>2]|0;Z=X+32|0;K=(c[k>>2]|0)+32|0;ca=(Z>>Y)+15&-16;aa=$(K,Z)|0;V=$(ca,K>>J)|0;qa=(Z<<4)+16|0;U=($(ca,16>>>J)|0)+(16>>>Y)|0;ea=0-U&15;_=V<<1;da=aa+16+_|0;ta=$(da,f)|0;if(((aa>>>0)/(Z>>>0)|0|0)!=(K|0)){I=-23;break}if((_|16)>>>0<V>>>0|da>>>0<aa>>>0){I=-23;break}if(((ta>>>0)/(f>>>0)|0|0)!=(da|0)){I=-23;break}da=xe(ta,16)|0;ta=Ye(c[T>>2]<<2)|0;c[b+172>>2]=ta;if((da|0)==0|(ta|0)==0){Ze(ta);ye(da);I=-1;break}_=c[j>>2]|0;K=b+236|0;c[K>>2]=_;ra=c[k>>2]|0;c[b+240>>2]=ra;oa=b+244|0;c[oa>>2]=Z;Z=_>>>Y;c[b+268>>2]=Z;c[b+252>>2]=Z;Z=ra>>>J;c[b+272>>2]=Z;c[b+256>>2]=Z;Z=b+276|0;c[Z>>2]=ca;J=b+260|0;c[J>>2]=ca;if((f|0)>1){ra=1;do{p=b+236+(ra*48|0)+0|0;n=K+0|0;l=p+48|0;do{c[p>>2]=c[n>>2];p=p+4|0;n=n+4|0}while((p|0)<(l|0));ra=ra+1|0;}while((ra|0)<(f|0))}c[b+572>>2]=da;if((f|0)>0){ra=ea+aa|0;K=ra+U|0;T=ra+V|0;ra=T+U|0;ba=V+16-ea+T|0;T=da;Y=0;while(1){_=b+236+(Y*48|0)|0;c[b+236+(Y*48|0)+12>>2]=T+qa;c[b+236+(Y*48|0)+28>>2]=T+K;c[b+236+(Y*48|0)+44>>2]=T+ra;ze(_,_);_=Y+1|0;if((_|0)<(f|0)){Y=_;T=T+ba|0}else{break}}}c[b+576>>2]=-32-X;ba=0-ca|0;c[b+584>>2]=ba;c[b+580>>2]=ba;ba=c[b+248>>2]|0;T=(c[M>>2]|0)+(c[L>>2]|0)|0;Y=c[b+72>>2]|0;if((T|0)>0){ra=c[oa>>2]<<3;K=(Y|0)>0;qa=0;da=ba;while(1){ea=qa+Y|0;if(K){V=qa+1|0;U=qa;aa=da;while(1){c[ta+(U<<2)>>2]=aa-ba;_=U+1|0;if((_|0)<(ea|0)){aa=aa+8|0;U=_}else{break}}xb=(ea|0)>(V|0)?ea:V}else{xb=qa}if((xb|0)<(T|0)){qa=xb;da=da+ra|0}else{yb=xb;break}}}else{yb=0}ra=(c[S>>2]|0)+(c[P>>2]|0)|0;da=c[O>>2]|0;if((yb|0)<(ra|0)){qa=c[J>>2]<<3;T=(da|0)>0;K=yb;Y=c[b+264>>2]|0;while(1){oa=K+da|0;if(T){L=K+1|0;M=K;ca=Y;while(1){c[ta+(M<<2)>>2]=ca-ba;X=M+1|0;if((X|0)<(oa|0)){ca=ca+8|0;M=X}else{break}}zb=(oa|0)>(L|0)?oa:L}else{zb=K}if((zb|0)<(ra|0)){K=zb;Y=Y+qa|0}else{Ab=zb;break}}}else{Ab=yb}qa=(c[R>>2]|0)+(c[Q>>2]|0)|0;Y=c[N>>2]|0;if((Ab|0)<(qa|0)){K=c[Z>>2]<<3;ra=(Y|0)>0;T=Ab;da=c[b+280>>2]|0;while(1){J=T+Y|0;if(ra){O=T+1|0;P=T;S=da;while(1){c[ta+(P<<2)>>2]=S-ba;M=P+1|0;if((M|0)<(J|0)){S=S+8|0;P=M}else{break}}Bb=(J|0)>(O|0)?J:O}else{Bb=T}if((Bb|0)<(qa|0)){T=Bb;da=da+K|0}else{break}}}K=b+524|0;c[K+0>>2]=-1;c[K+4>>2]=-1;c[K+8>>2]=-1;c[K+12>>2]=-1;c[K+16>>2]=-1;c[K+20>>2]=-1;K=b+548|0;c[K+0>>2]=0;c[K+4>>2]=0;c[K+8>>2]=0;c[K+12>>2]=0;c[K+16>>2]=0;c[K+20>>2]=0;if((c[e+60>>2]|0)>>>0>31){c[b+60>>2]=31}K=b+848|0;c[K>>2]=0;c[K+4>>2]=0;K=b+856|0;c[K>>2]=-1;c[K+4>>2]=-1;K=a[e]|0;do{if((K&255)>3){Cb=1}else{if(!(K<<24>>24==3)){Cb=0;break}da=a[e+1|0]|0;if((da&255)>2){Cb=1;break}if(!(da<<24>>24==2)){Cb=0;break}Cb=(a[e+2|0]|0)!=0|0}}while(0);a[b+873|0]=Cb;h=0;i=g;return h|0}}while(0);Ze(c[b+216>>2]|0);Ze(c[b+200>>2]|0);Ze(c[b+196>>2]|0);Ze(c[b+188>>2]|0);Ze(c[b+184>>2]|0);Ze(c[b+176>>2]|0);Ze(c[b+168>>2]|0);h=I;i=g;return h|0}function Ge(a){a=a|0;var b=0;b=i;Ze(c[a+172>>2]|0);ye(c[a+572>>2]|0);Ze(c[a+216>>2]|0);Ze(c[a+200>>2]|0);Ze(c[a+196>>2]|0);Ze(c[a+188>>2]|0);Ze(c[a+184>>2]|0);Ze(c[a+176>>2]|0);Ze(c[a+168>>2]|0);i=b;return}function He(b,d,e,f,g){b=b|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,j=0,k=0,l=0,m=0,n=0,o=0;h=i;if((e|0)==0){j=0}else{j=c[b+48>>2]&1^1}k=16>>>j;j=c[b+236+(d*48|0)+(e<<4)+8>>2]|0;l=c[b+236+(d*48|0)+(e<<4)+12>>2]|0;m=$(j,f)|0;f=$(j,g)|0;g=l+f|0;if((m|0)==(f|0)){i=h;return}f=0-k|0;n=l+m|0;o=l+(m+ -1+(c[b+236+(d*48|0)+(e<<4)>>2]|0))|0;while(1){hf(n+f|0,a[n]|0,k|0)|0;hf(o+1|0,a[o]|0,k|0)|0;e=n+j|0;if((e|0)==(g|0)){break}else{o=o+j|0;n=e}}i=h;return}function Ie(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;e=i;if((d|0)==0){f=16;g=0}else{h=c[a+48>>2]|0;f=16>>>(h&1^1);g=h>>>1&1^1}h=c[a+236+(b*48|0)+(d<<4)+8>>2]|0;j=(c[a+236+(b*48|0)+(d<<4)>>2]|0)+(f<<1)|0;k=c[a+236+(b*48|0)+(d<<4)+12>>2]|0;l=0-f|0;m=0-(f+($(h,16>>>g)|0))|0;g=k+m|0;if((l|0)==(m|0)){i=e;return}m=0-h|0;n=k+l|0;l=k+(($((c[a+236+(b*48|0)+(d<<4)+4>>2]|0)+ -1|0,h)|0)-f)|0;while(1){f=n+m|0;ff(f|0,n|0,j|0)|0;d=l+h|0;ff(d|0,l|0,j|0)|0;if((f|0)==(g|0)){break}else{l=d;n=f}}i=e;return}function Je(d,e,f,g,h,j){d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0;k=i;l=$(b[g>>1]|0,j&65535)|0;if((h|0)<2){j=(l+15|0)>>>5&65535;m=0;do{b[g+(m+64<<1)>>1]=j;m=m+1|0;}while((m|0)<64)}else{b[g>>1]=l;Ve(g+128|0,g,h)}h=c[(c[d+172>>2]|0)+(e<<2)>>2]|0;l=(c[(c[d+168>>2]|0)+(e<<2)>>2]|0)>>>6&3;m=c[d+576+(f<<2)>>2]|0;j=(c[d+556>>2]|0)+h|0;if((l|0)==2){he(j,m,g+128|0);i=k;return}n=c[d+548+(l<<2)>>2]|0;l=b[(c[d+176>>2]|0)+(e<<1)>>1]|0;e=(f|0)!=0;if(e){o=(c[d+48>>2]|0)>>>1&1^1}else{o=0}f=(l<<16>>16>>8)+31|0;p=a[63464+(o<<6)+f|0]|0;if(e){q=c[d+48>>2]&1^1}else{q=0}d=((l&255)<<24>>24)+31|0;l=a[63464+(q<<6)+d|0]|0;e=(a[63336+(q<<6)+d|0]|0)+($(a[63336+(o<<6)+f|0]|0,m)|0)|0;if((l|p)<<24>>24==0){ie(j,n+(e+h)|0,m,g+128|0);i=k;return}else{je(j,n+(e+h)|0,n+(($(p<<24>>24,m)|0)+h+e+(l<<24>>24))|0,m,g+128|0);i=k;return}}function Ke(b,c){b=b|0;c=c|0;var d=0,e=0,f=0,g=0;d=i;hf(b|0,0,256)|0;if((c|0)>0){e=0}else{i=d;return}do{f=127-e|0;g=f-c|0;if((g|0)>-1){a[b+g|0]=e-c}a[b+f|0]=0-e;f=e+127|0;a[b+f|0]=e;g=f+c|0;if((g|0)<256){a[b+g|0]=c-e}e=e+1|0;}while((e|0)<(c|0));i=d;return}function Le(b,e,f,g,h,j){b=b|0;e=e|0;f=f|0;g=g|0;h=h|0;j=j|0;var k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0;k=i;l=c[b+72+(g<<5)>>2]|0;m=c[b+72+(g<<5)+8>>2]|0;n=(c[b+72+(g<<5)+12>>2]|0)+m|0;o=m+($(l,h)|0)|0;h=m+($(l,j)|0)|0;j=c[b+576+(g<<2)>>2]|0;g=c[b+168>>2]|0;p=c[b+172>>2]|0;q=c[b+548+(f<<2)>>2]|0;if((o|0)>=(h|0)){i=k;return}f=j<<1;b=(j*3|0)-f|0;r=j-f|0;s=j<<3;t=o;while(1){o=t+l|0;if((l|0)>0){u=(t|0)>(m|0);v=t;while(1){do{if((c[g+(v<<2)>>2]&1|0)==0){w=v+1|0}else{x=c[p+(v<<2)>>2]|0;if((v|0)>(t|0)){y=q+(x+ -2)|0;z=0;while(1){A=y+2|0;B=d[A]|0;C=y+1|0;D=d[C]|0;E=a[e+(((d[y]|0)+4-(d[y+3|0]|0)+((B-D|0)*3|0)>>3)+127)|0]|0;F=E+D|0;a[C]=(F>>>31)+255&((F|0)>255?255:F);F=B-E|0;a[A]=(F>>>31)+255&((F|0)>255?255:F);F=z+1|0;if((F|0)<8){z=F;y=y+j|0}else{break}}}if(u){y=x-f|0;z=b+x|0;F=r+x|0;A=0;do{E=q+(A+x)|0;B=q+(F+A)|0;C=d[B]|0;D=a[e+(((d[q+(y+A)|0]|0)+4-(d[q+(z+A)|0]|0)+(((d[E]|0)-C|0)*3|0)>>3)+127)|0]|0;G=D+C|0;a[B]=(G>>>31)+255&((G|0)>255?255:G);G=(d[E]|0)-D|0;a[E]=(G>>>31)+255&((G|0)>255?255:G);A=A+1|0;}while((A|0)<8)}A=v+1|0;do{if((A|0)<(o|0)){if((c[g+(A<<2)>>2]&1|0)!=0){break}z=q+(x+6)|0;y=0;while(1){F=z+2|0;G=d[F]|0;E=z+1|0;D=d[E]|0;B=a[e+(((d[z]|0)+4-(d[z+3|0]|0)+((G-D|0)*3|0)>>3)+127)|0]|0;C=B+D|0;a[E]=(C>>>31)+255&((C|0)>255?255:C);C=G-B|0;a[F]=(C>>>31)+255&((C|0)>255?255:C);C=y+1|0;if((C|0)<8){y=C;z=z+j|0}else{break}}}}while(0);z=v+l|0;if((z|0)>=(n|0)){w=A;break}if((c[g+(z<<2)>>2]&1|0)!=0){w=A;break}z=x+s|0;y=z-f|0;C=b+z|0;F=r+z|0;B=0;while(1){G=q+(B+z)|0;E=q+(F+B)|0;D=d[E]|0;H=a[e+(((d[q+(y+B)|0]|0)+4-(d[q+(C+B)|0]|0)+(((d[G]|0)-D|0)*3|0)>>3)+127)|0]|0;I=H+D|0;a[E]=(I>>>31)+255&((I|0)>255?255:I);I=(d[G]|0)-H|0;a[G]=(I>>>31)+255&((I|0)>255?255:I);I=B+1|0;if((I|0)<8){B=I}else{w=A;break}}}}while(0);if((w|0)<(o|0)){v=w}else{break}}}if((o|0)<(h|0)){t=o}else{break}}i=k;return}function Me(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0.0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;f=i;if(!((e|0)>-1|(e|0)==-1&d>>>0>4294967295)){g=-1.0;i=f;return+g}h=c[b+60>>2]|0;j=nf(d|0,e|0,h|0)|0;k=D;l=jf(j|0,k|0,h|0)|0;h=D;m=a[b]|0;do{if((m&255)>3){n=1;o=0}else{if(!(m<<24>>24==3)){n=0;o=0;break}p=a[b+1|0]|0;if((p&255)>2){n=1;o=0;break}if(!(p<<24>>24==2)){n=0;o=0;break}n=(a[b+2|0]|0)!=0|0;o=0}}while(0);m=mf(d|0,e|0,1,0)|0;e=mf(m|0,D|0,j|0,k|0)|0;k=lf(e|0,D|0,l|0,h|0)|0;h=lf(k|0,D|0,n|0,o|0)|0;g=(+(h>>>0)+4294967296.0*+(D|0))*(+((c[b+32>>2]|0)>>>0)/+((c[b+28>>2]|0)>>>0));i=f;return+g}function Ne(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=($(c[b+32>>2]|0,e>>1)|0)+(d>>1)|0;c[a+16>>2]=f+(c[b+40>>2]|0);c[a+32>>2]=f+(c[b+72>>2]|0);i=i;return}function Oe(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0;f=($(c[b+32>>2]|0,e>>1)|0)+d|0;d=b+40|0;e=b+72|0;c[a+16>>2]=(c[d>>2]|0)+f;c[a+32>>2]=(c[e>>2]|0)+f;b=f+1|0;c[a+20>>2]=(c[d>>2]|0)+b;c[a+36>>2]=(c[e>>2]|0)+b;i=i;return}function Pe(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=b+32|0;g=($(c[f>>2]|0,e)|0)+(d>>1)|0;d=b+40|0;e=b+72|0;c[a+16>>2]=(c[d>>2]|0)+g;c[a+32>>2]=(c[e>>2]|0)+g;b=(c[f>>2]|0)+g|0;c[a+24>>2]=(c[d>>2]|0)+b;c[a+40>>2]=(c[e>>2]|0)+b;i=i;return}function Qe(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;e=b+40|0;d=b+72|0;b=c[a>>2]|0;c[a+16>>2]=(c[e>>2]|0)+b;c[a+32>>2]=(c[d>>2]|0)+b;b=c[a+4>>2]|0;c[a+20>>2]=(c[e>>2]|0)+b;c[a+36>>2]=(c[d>>2]|0)+b;b=c[a+8>>2]|0;c[a+24>>2]=(c[e>>2]|0)+b;c[a+40>>2]=(c[d>>2]|0)+b;b=c[a+12>>2]|0;c[a+28>>2]=(c[e>>2]|0)+b;c[a+44>>2]=(c[d>>2]|0)+b;i=i;return}function Re(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;e=i;f=a;c[f+0>>2]=0;c[f+4>>2]=0;c[f+8>>2]=0;c[f+12>>2]=0;c[f+16>>2]=0;c[a+4>>2]=b;c[a>>2]=b+d;i=e;return}function Se(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0;e=i;f=a+8|0;g=a+12|0;h=c[g>>2]|0;if((b|0)==0){j=0;i=e;return j|0}k=c[f>>2]|0;if((h|0)<(b|0)){l=c[a>>2]|0;m=a+4|0;n=c[m>>2]|0;o=32-h|0;p=n>>>0<l>>>0;if(o>>>0>7&p){q=n;r=o;s=k;while(1){t=r+ -8|0;u=q+1|0;v=(d[q]|0)<<t|s;w=u>>>0<l>>>0;if(t>>>0>7&w){s=v;r=t;q=u}else{x=w;y=u;z=t;A=v;break}}}else{x=p;y=n;z=o;A=k}c[m>>2]=y;m=32-z|0;do{if((m|0)<(b|0)){if(x){B=m;C=(d[y]|0)>>>(m&7)|A;break}else{c[a+16>>2]=1;B=1073741824;C=A;break}}else{B=m;C=A}}while(0);c[g>>2]=B;D=B;E=C}else{D=h;E=k}c[f>>2]=E<<1<<b+ -1;c[g>>2]=D-b;j=E>>>(32-b|0);i=e;return j|0}function Te(a){a=a|0;var b=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0;b=i;e=a+8|0;f=c[e>>2]|0;g=a+12|0;h=c[g>>2]|0;if((h|0)>=1){j=h;k=f;l=k>>>31;m=j+ -1|0;n=k<<1;o=e;c[o>>2]=n;p=g;c[p>>2]=m;i=b;return l|0}q=c[a>>2]|0;r=a+4|0;s=c[r>>2]|0;t=32-h|0;h=s>>>0<q>>>0;if(t>>>0>7&h){u=s;v=t;w=f;while(1){x=v+ -8|0;y=u+1|0;z=(d[u]|0)<<x|w;A=y>>>0<q>>>0;if(x>>>0>7&A){w=z;v=x;u=y}else{B=A;C=y;D=x;E=z;break}}}else{B=h;C=s;D=t;E=f}c[r>>2]=C;r=32-D|0;do{if((r|0)<1){if(B){F=r;G=(d[C]|0)>>>(r&7)|E;break}else{c[a+16>>2]=1;F=1073741824;G=E;break}}else{F=r;G=E}}while(0);c[g>>2]=F;j=F;k=G;l=k>>>31;m=j+ -1|0;n=k<<1;o=e;c[o>>2]=n;p=g;c[p>>2]=m;i=b;return l|0}function Ue(a){a=a|0;var b=0,d=0;b=i;if((c[a+16>>2]|0)!=0){d=-1;i=b;return d|0}d=(c[a>>2]|0)-(c[a+4>>2]|0)+(c[a+12>>2]>>3)|0;i=b;return d|0}function Ve(a,c,d){a=a|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;e=i;i=i+128|0;f=e;g=f;if((d|0)<4){h=c+2|0;j=(b[c>>1]|0)*46341>>16;k=b[h>>1]|0;l=k*12785>>16;m=k*64277>>16;k=l*46341>>16;n=m*46341>>16;o=n+k|0;p=n-k|0;b[f>>1]=m+j;b[g+16>>1]=o+j;b[g+32>>1]=p+j;b[g+48>>1]=l+j;b[g+64>>1]=j-l;b[g+80>>1]=j-p;b[g+96>>1]=j-o;b[g+112>>1]=j-m;m=c+16|0;j=((b[m>>1]|0)*46341|0)>>>16&65535;b[g+114>>1]=j;b[g+98>>1]=j;b[g+82>>1]=j;b[g+66>>1]=j;b[g+50>>1]=j;b[g+34>>1]=j;b[g+18>>1]=j;b[g+2>>1]=j;j=0;while(1){o=j<<3;p=(b[g+(o<<1)>>1]|0)*46341>>16;l=b[g+((o|1)<<1)>>1]|0;o=l*12785>>16;k=l*64277>>16;l=o*46341>>16;n=k*46341>>16;q=n+l|0;r=n-l|0;b[a+(j<<1)>>1]=k+p;b[a+(j+8<<1)>>1]=q+p;b[a+(j+16<<1)>>1]=r+p;b[a+(j+24<<1)>>1]=o+p;b[a+(j+32<<1)>>1]=p-o;b[a+(j+40<<1)>>1]=p-r;b[a+(j+48<<1)>>1]=p-q;b[a+(j+56<<1)>>1]=p-k;k=j+1|0;if((k|0)<8){j=k}else{s=0;break}}do{j=a+(s<<1)|0;b[j>>1]=((b[j>>1]|0)+8|0)>>>4;s=s+1|0;}while((s|0)<64);b[m>>1]=0;b[h>>1]=0;b[c>>1]=0;i=e;return}if((d|0)>=11){We(g,c);We(g+2|0,c+16|0);We(g+4|0,c+32|0);We(g+6|0,c+48|0);We(g+8|0,c+64|0);We(g+10|0,c+80|0);We(g+12|0,c+96|0);We(g+14|0,c+112|0);We(a,g);We(a+2|0,g+16|0);We(a+4|0,g+32|0);We(a+6|0,g+48|0);We(a+8|0,g+64|0);We(a+10|0,g+80|0);We(a+12|0,g+96|0);We(a+14|0,g+112|0);d=0;do{h=a+(d<<1)|0;b[h>>1]=((b[h>>1]|0)+8|0)>>>4;d=d+1|0;}while((d|0)<64);d=c+0|0;h=d+128|0;do{b[d>>1]=0;d=d+2|0}while((d|0)<(h|0));i=e;return}d=(b[c>>1]|0)*46341>>16;h=b[c+4>>1]|0;m=h*25080>>16;s=h*60547>>16;h=b[c+2>>1]|0;j=h*12785>>16;k=b[c+6>>1]|0;p=k*36410>>16;q=k*54491>>16;k=h*64277>>16;h=j-p|0;r=(p+j<<16>>16)*46341>>16;j=q+k|0;p=(k-q<<16>>16)*46341>>16;q=m+d|0;k=d-m|0;m=s+d|0;o=d-s|0;s=p+r|0;d=p-r|0;b[f>>1]=j+m;b[g+16>>1]=s+q;b[g+32>>1]=d+k;b[g+48>>1]=h+o;b[g+64>>1]=o-h;b[g+80>>1]=k-d;b[g+96>>1]=q-s;b[g+112>>1]=m-j;j=c+16|0;m=c+18|0;s=c+20|0;q=(b[j>>1]|0)*46341>>16;d=b[s>>1]|0;k=d*25080>>16;h=d*60547>>16;d=b[m>>1]|0;o=d*12785>>16;f=d*64277>>16;d=o*46341>>16;r=f*46341>>16;p=k+q|0;l=q-k|0;k=h+q|0;n=q-h|0;h=r+d|0;q=r-d|0;b[g+2>>1]=k+f;b[g+18>>1]=h+p;b[g+34>>1]=q+l;b[g+50>>1]=n+o;b[g+66>>1]=n-o;b[g+82>>1]=l-q;b[g+98>>1]=p-h;b[g+114>>1]=k-f;f=c+32|0;k=c+34|0;h=(b[f>>1]|0)*46341>>16;p=b[k>>1]|0;q=p*12785>>16;l=p*64277>>16;p=q*46341>>16;o=l*46341>>16;n=o+p|0;d=o-p|0;b[g+4>>1]=l+h;b[g+20>>1]=n+h;b[g+36>>1]=d+h;b[g+52>>1]=q+h;b[g+68>>1]=h-q;b[g+84>>1]=h-d;b[g+100>>1]=h-n;b[g+116>>1]=h-l;l=c+48|0;h=((b[l>>1]|0)*46341|0)>>>16&65535;b[g+118>>1]=h;b[g+102>>1]=h;b[g+86>>1]=h;b[g+70>>1]=h;b[g+54>>1]=h;b[g+38>>1]=h;b[g+22>>1]=h;b[g+6>>1]=h;h=0;while(1){n=h<<3;d=(b[g+(n<<1)>>1]|0)*46341>>16;q=b[g+((n|2)<<1)>>1]|0;p=q*25080>>16;o=q*60547>>16;q=b[g+((n|1)<<1)>>1]|0;r=q*12785>>16;t=b[g+((n|3)<<1)>>1]|0;n=t*36410>>16;u=t*54491>>16;t=q*64277>>16;q=r-n|0;v=(n+r<<16>>16)*46341>>16;r=u+t|0;n=(t-u<<16>>16)*46341>>16;u=p+d|0;t=d-p|0;p=o+d|0;w=d-o|0;o=n+v|0;d=n-v|0;b[a+(h<<1)>>1]=r+p;b[a+(h+8<<1)>>1]=o+u;b[a+(h+16<<1)>>1]=d+t;b[a+(h+24<<1)>>1]=q+w;b[a+(h+32<<1)>>1]=w-q;b[a+(h+40<<1)>>1]=t-d;b[a+(h+48<<1)>>1]=u-o;b[a+(h+56<<1)>>1]=p-r;r=h+1|0;if((r|0)<8){h=r}else{x=0;break}}do{h=a+(x<<1)|0;b[h>>1]=((b[h>>1]|0)+8|0)>>>4;x=x+1|0;}while((x|0)<64);b[l>>1]=0;b[k>>1]=0;b[f>>1]=0;b[s>>1]=0;b[m>>1]=0;b[j>>1]=0;j=c;c=j;b[c>>1]=0;b[c+2>>1]=0>>>16;c=j+4|0;b[c>>1]=0;b[c+2>>1]=0>>>16;i=e;return}function We(a,c){a=a|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0;d=b[c>>1]|0;e=b[c+8>>1]|0;f=(e+d<<16>>16<<16>>16)*46341>>16;g=(d-e<<16>>16<<16>>16)*46341>>16;e=b[c+4>>1]|0;d=b[c+12>>1]|0;h=(e*25080>>16)-(d*60547>>16)|0;j=(d*25080>>16)+(e*60547>>16)|0;e=b[c+2>>1]|0;d=b[c+14>>1]|0;k=(e*12785>>16)-(d*64277>>16)|0;l=b[c+10>>1]|0;m=b[c+6>>1]|0;c=(l*54491>>16)-(m*36410>>16)|0;n=(m*54491>>16)+(l*36410>>16)|0;l=(d*12785>>16)+(e*64277>>16)|0;e=c+k|0;d=(k-c<<16>>16)*46341>>16;c=n+l|0;k=(l-n<<16>>16)*46341>>16;n=j+f|0;l=f-j|0;j=h+g|0;f=g-h|0;h=k+d|0;g=k-d|0;b[a>>1]=c+n;b[a+16>>1]=h+j;b[a+32>>1]=g+f;b[a+48>>1]=e+l;b[a+64>>1]=l-e;b[a+80>>1]=f-g;b[a+96>>1]=j-h;b[a+112>>1]=n-c;i=i;return}function Xe(a,b){a=+a;b=b|0;var c=0,d=0.0;c=i;d=+cf(a,b);i=c;return+d}
function Ye(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Da=0,Ea=0,Fa=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0;b=i;do{if(a>>>0<245){if(a>>>0<11){d=16}else{d=a+11&-8}e=d>>>3;f=c[15934]|0;g=f>>>e;if((g&3|0)!=0){h=(g&1^1)+e|0;j=h<<1;k=63776+(j<<2)|0;l=63776+(j+2<<2)|0;j=c[l>>2]|0;m=j+8|0;n=c[m>>2]|0;do{if((k|0)==(n|0)){c[15934]=f&~(1<<h)}else{if(n>>>0<(c[63752>>2]|0)>>>0){Ta()}o=n+12|0;if((c[o>>2]|0)==(j|0)){c[o>>2]=k;c[l>>2]=n;break}else{Ta()}}}while(0);n=h<<3;c[j+4>>2]=n|3;l=j+(n|4)|0;c[l>>2]=c[l>>2]|1;p=m;i=b;return p|0}if(!(d>>>0>(c[63744>>2]|0)>>>0)){q=d;break}if((g|0)!=0){l=2<<e;n=g<<e&(l|0-l);l=(n&0-n)+ -1|0;n=l>>>12&16;k=l>>>n;l=k>>>5&8;o=k>>>l;k=o>>>2&4;r=o>>>k;o=r>>>1&2;s=r>>>o;r=s>>>1&1;t=(l|n|k|o|r)+(s>>>r)|0;r=t<<1;s=63776+(r<<2)|0;o=63776+(r+2<<2)|0;r=c[o>>2]|0;k=r+8|0;n=c[k>>2]|0;do{if((s|0)==(n|0)){c[15934]=f&~(1<<t)}else{if(n>>>0<(c[63752>>2]|0)>>>0){Ta()}l=n+12|0;if((c[l>>2]|0)==(r|0)){c[l>>2]=s;c[o>>2]=n;break}else{Ta()}}}while(0);n=t<<3;o=n-d|0;c[r+4>>2]=d|3;s=r+d|0;c[r+(d|4)>>2]=o|1;c[r+n>>2]=o;n=c[63744>>2]|0;if((n|0)!=0){f=c[63756>>2]|0;e=n>>>3;n=e<<1;g=63776+(n<<2)|0;m=c[15934]|0;j=1<<e;do{if((m&j|0)==0){c[15934]=m|j;u=g;v=63776+(n+2<<2)|0}else{e=63776+(n+2<<2)|0;h=c[e>>2]|0;if(!(h>>>0<(c[63752>>2]|0)>>>0)){u=h;v=e;break}Ta()}}while(0);c[v>>2]=f;c[u+12>>2]=f;c[f+8>>2]=u;c[f+12>>2]=g}c[63744>>2]=o;c[63756>>2]=s;p=k;i=b;return p|0}n=c[63740>>2]|0;if((n|0)==0){q=d;break}j=(n&0-n)+ -1|0;n=j>>>12&16;m=j>>>n;j=m>>>5&8;r=m>>>j;m=r>>>2&4;t=r>>>m;r=t>>>1&2;e=t>>>r;t=e>>>1&1;h=c[64040+((j|n|m|r|t)+(e>>>t)<<2)>>2]|0;t=(c[h+4>>2]&-8)-d|0;e=h;r=h;while(1){h=c[e+16>>2]|0;if((h|0)==0){m=c[e+20>>2]|0;if((m|0)==0){break}else{w=m}}else{w=h}h=(c[w+4>>2]&-8)-d|0;m=h>>>0<t>>>0;t=m?h:t;e=w;r=m?w:r}e=c[63752>>2]|0;if(r>>>0<e>>>0){Ta()}k=r+d|0;if(!(r>>>0<k>>>0)){Ta()}s=c[r+24>>2]|0;o=c[r+12>>2]|0;do{if((o|0)==(r|0)){g=r+20|0;f=c[g>>2]|0;if((f|0)==0){m=r+16|0;h=c[m>>2]|0;if((h|0)==0){x=0;break}else{y=m;z=h}}else{y=g;z=f}while(1){f=z+20|0;g=c[f>>2]|0;if((g|0)!=0){z=g;y=f;continue}f=z+16|0;g=c[f>>2]|0;if((g|0)==0){break}else{y=f;z=g}}if(y>>>0<e>>>0){Ta()}else{c[y>>2]=0;x=z;break}}else{g=c[r+8>>2]|0;if(g>>>0<e>>>0){Ta()}f=g+12|0;if((c[f>>2]|0)!=(r|0)){Ta()}h=o+8|0;if((c[h>>2]|0)==(r|0)){c[f>>2]=o;c[h>>2]=g;x=o;break}else{Ta()}}}while(0);a:do{if((s|0)!=0){o=c[r+28>>2]|0;e=64040+(o<<2)|0;do{if((r|0)==(c[e>>2]|0)){c[e>>2]=x;if((x|0)!=0){break}c[63740>>2]=c[63740>>2]&~(1<<o);break a}else{if(s>>>0<(c[63752>>2]|0)>>>0){Ta()}g=s+16|0;if((c[g>>2]|0)==(r|0)){c[g>>2]=x}else{c[s+20>>2]=x}if((x|0)==0){break a}}}while(0);if(x>>>0<(c[63752>>2]|0)>>>0){Ta()}c[x+24>>2]=s;o=c[r+16>>2]|0;do{if((o|0)!=0){if(o>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[x+16>>2]=o;c[o+24>>2]=x;break}}}while(0);o=c[r+20>>2]|0;if((o|0)==0){break}if(o>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[x+20>>2]=o;c[o+24>>2]=x;break}}}while(0);if(t>>>0<16){s=t+d|0;c[r+4>>2]=s|3;o=r+(s+4)|0;c[o>>2]=c[o>>2]|1}else{c[r+4>>2]=d|3;c[r+(d|4)>>2]=t|1;c[r+(t+d)>>2]=t;o=c[63744>>2]|0;if((o|0)!=0){s=c[63756>>2]|0;e=o>>>3;o=e<<1;g=63776+(o<<2)|0;h=c[15934]|0;f=1<<e;do{if((h&f|0)==0){c[15934]=h|f;A=g;B=63776+(o+2<<2)|0}else{e=63776+(o+2<<2)|0;m=c[e>>2]|0;if(!(m>>>0<(c[63752>>2]|0)>>>0)){A=m;B=e;break}Ta()}}while(0);c[B>>2]=s;c[A+12>>2]=s;c[s+8>>2]=A;c[s+12>>2]=g}c[63744>>2]=t;c[63756>>2]=k}p=r+8|0;i=b;return p|0}else{if(a>>>0>4294967231){q=-1;break}o=a+11|0;f=o&-8;h=c[63740>>2]|0;if((h|0)==0){q=f;break}e=0-f|0;m=o>>>8;do{if((m|0)==0){C=0}else{if(f>>>0>16777215){C=31;break}o=(m+1048320|0)>>>16&8;n=m<<o;j=(n+520192|0)>>>16&4;l=n<<j;n=(l+245760|0)>>>16&2;D=14-(j|o|n)+(l<<n>>>15)|0;C=f>>>(D+7|0)&1|D<<1}}while(0);m=c[64040+(C<<2)>>2]|0;b:do{if((m|0)==0){E=e;F=0;G=0}else{if((C|0)==31){H=0}else{H=25-(C>>>1)|0}r=e;k=0;t=f<<H;g=m;s=0;while(1){D=c[g+4>>2]&-8;n=D-f|0;if(n>>>0<r>>>0){if((D|0)==(f|0)){E=n;F=g;G=g;break b}else{I=n;J=g}}else{I=r;J=s}n=c[g+20>>2]|0;D=c[g+16+(t>>>31<<2)>>2]|0;l=(n|0)==0|(n|0)==(D|0)?k:n;if((D|0)==0){E=I;F=l;G=J;break}else{r=I;k=l;t=t<<1;g=D;s=J}}}}while(0);if((F|0)==0&(G|0)==0){m=2<<C;e=h&(m|0-m);if((e|0)==0){q=f;break}m=(e&0-e)+ -1|0;e=m>>>12&16;s=m>>>e;m=s>>>5&8;g=s>>>m;s=g>>>2&4;t=g>>>s;g=t>>>1&2;k=t>>>g;t=k>>>1&1;K=c[64040+((m|e|s|g|t)+(k>>>t)<<2)>>2]|0}else{K=F}if((K|0)==0){L=E;M=G}else{t=E;k=K;g=G;while(1){s=(c[k+4>>2]&-8)-f|0;e=s>>>0<t>>>0;m=e?s:t;s=e?k:g;e=c[k+16>>2]|0;if((e|0)!=0){N=s;O=m;g=N;k=e;t=O;continue}e=c[k+20>>2]|0;if((e|0)==0){L=m;M=s;break}else{N=s;O=m;k=e;g=N;t=O}}}if((M|0)==0){q=f;break}if(!(L>>>0<((c[63744>>2]|0)-f|0)>>>0)){q=f;break}t=c[63752>>2]|0;if(M>>>0<t>>>0){Ta()}g=M+f|0;if(!(M>>>0<g>>>0)){Ta()}k=c[M+24>>2]|0;h=c[M+12>>2]|0;do{if((h|0)==(M|0)){e=M+20|0;m=c[e>>2]|0;if((m|0)==0){s=M+16|0;r=c[s>>2]|0;if((r|0)==0){P=0;break}else{Q=s;R=r}}else{Q=e;R=m}while(1){m=R+20|0;e=c[m>>2]|0;if((e|0)!=0){R=e;Q=m;continue}m=R+16|0;e=c[m>>2]|0;if((e|0)==0){break}else{Q=m;R=e}}if(Q>>>0<t>>>0){Ta()}else{c[Q>>2]=0;P=R;break}}else{e=c[M+8>>2]|0;if(e>>>0<t>>>0){Ta()}m=e+12|0;if((c[m>>2]|0)!=(M|0)){Ta()}r=h+8|0;if((c[r>>2]|0)==(M|0)){c[m>>2]=h;c[r>>2]=e;P=h;break}else{Ta()}}}while(0);c:do{if((k|0)!=0){h=c[M+28>>2]|0;t=64040+(h<<2)|0;do{if((M|0)==(c[t>>2]|0)){c[t>>2]=P;if((P|0)!=0){break}c[63740>>2]=c[63740>>2]&~(1<<h);break c}else{if(k>>>0<(c[63752>>2]|0)>>>0){Ta()}e=k+16|0;if((c[e>>2]|0)==(M|0)){c[e>>2]=P}else{c[k+20>>2]=P}if((P|0)==0){break c}}}while(0);if(P>>>0<(c[63752>>2]|0)>>>0){Ta()}c[P+24>>2]=k;h=c[M+16>>2]|0;do{if((h|0)!=0){if(h>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[P+16>>2]=h;c[h+24>>2]=P;break}}}while(0);h=c[M+20>>2]|0;if((h|0)==0){break}if(h>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[P+20>>2]=h;c[h+24>>2]=P;break}}}while(0);d:do{if(L>>>0<16){k=L+f|0;c[M+4>>2]=k|3;h=M+(k+4)|0;c[h>>2]=c[h>>2]|1}else{c[M+4>>2]=f|3;c[M+(f|4)>>2]=L|1;c[M+(L+f)>>2]=L;h=L>>>3;if(L>>>0<256){k=h<<1;t=63776+(k<<2)|0;e=c[15934]|0;r=1<<h;do{if((e&r|0)==0){c[15934]=e|r;S=t;T=63776+(k+2<<2)|0}else{h=63776+(k+2<<2)|0;m=c[h>>2]|0;if(!(m>>>0<(c[63752>>2]|0)>>>0)){S=m;T=h;break}Ta()}}while(0);c[T>>2]=g;c[S+12>>2]=g;c[M+(f+8)>>2]=S;c[M+(f+12)>>2]=t;break}k=L>>>8;do{if((k|0)==0){U=0}else{if(L>>>0>16777215){U=31;break}r=(k+1048320|0)>>>16&8;e=k<<r;h=(e+520192|0)>>>16&4;m=e<<h;e=(m+245760|0)>>>16&2;s=14-(h|r|e)+(m<<e>>>15)|0;U=L>>>(s+7|0)&1|s<<1}}while(0);k=64040+(U<<2)|0;c[M+(f+28)>>2]=U;c[M+(f+20)>>2]=0;c[M+(f+16)>>2]=0;t=c[63740>>2]|0;s=1<<U;if((t&s|0)==0){c[63740>>2]=t|s;c[k>>2]=g;c[M+(f+24)>>2]=k;c[M+(f+12)>>2]=g;c[M+(f+8)>>2]=g;break}s=c[k>>2]|0;if((U|0)==31){V=0}else{V=25-(U>>>1)|0}e:do{if((c[s+4>>2]&-8|0)==(L|0)){W=s}else{k=L<<V;t=s;while(1){X=t+16+(k>>>31<<2)|0;e=c[X>>2]|0;if((e|0)==0){break}if((c[e+4>>2]&-8|0)==(L|0)){W=e;break e}else{k=k<<1;t=e}}if(X>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[X>>2]=g;c[M+(f+24)>>2]=t;c[M+(f+12)>>2]=g;c[M+(f+8)>>2]=g;break d}}}while(0);s=W+8|0;k=c[s>>2]|0;e=c[63752>>2]|0;if(W>>>0<e>>>0){Ta()}if(k>>>0<e>>>0){Ta()}else{c[k+12>>2]=g;c[s>>2]=g;c[M+(f+8)>>2]=k;c[M+(f+12)>>2]=W;c[M+(f+24)>>2]=0;break}}}while(0);p=M+8|0;i=b;return p|0}}while(0);M=c[63744>>2]|0;if(!(q>>>0>M>>>0)){W=M-q|0;X=c[63756>>2]|0;if(W>>>0>15){c[63756>>2]=X+q;c[63744>>2]=W;c[X+(q+4)>>2]=W|1;c[X+M>>2]=W;c[X+4>>2]=q|3}else{c[63744>>2]=0;c[63756>>2]=0;c[X+4>>2]=M|3;W=X+(M+4)|0;c[W>>2]=c[W>>2]|1}p=X+8|0;i=b;return p|0}X=c[63748>>2]|0;if(q>>>0<X>>>0){W=X-q|0;c[63748>>2]=W;X=c[63760>>2]|0;c[63760>>2]=X+q;c[X+(q+4)>>2]=W|1;c[X+4>>2]=q|3;p=X+8|0;i=b;return p|0}do{if((c[16052]|0)==0){X=Ga(30)|0;if((X+ -1&X|0)==0){c[64216>>2]=X;c[64212>>2]=X;c[64220>>2]=-1;c[64224>>2]=-1;c[64228>>2]=0;c[64180>>2]=0;c[16052]=(Va(0)|0)&-16^1431655768;break}else{Ta()}}}while(0);X=q+48|0;W=c[64216>>2]|0;M=q+47|0;L=W+M|0;V=0-W|0;W=L&V;if(!(W>>>0>q>>>0)){p=0;i=b;return p|0}U=c[64176>>2]|0;do{if((U|0)!=0){S=c[64168>>2]|0;T=S+W|0;if(T>>>0<=S>>>0|T>>>0>U>>>0){p=0}else{break}i=b;return p|0}}while(0);f:do{if((c[64180>>2]&4|0)==0){U=c[63760>>2]|0;g:do{if((U|0)==0){Y=182}else{T=64184|0;while(1){S=c[T>>2]|0;if(!(S>>>0>U>>>0)){Z=T+4|0;if((S+(c[Z>>2]|0)|0)>>>0>U>>>0){break}}S=c[T+8>>2]|0;if((S|0)==0){Y=182;break g}else{T=S}}if((T|0)==0){Y=182;break}S=L-(c[63748>>2]|0)&V;if(!(S>>>0<2147483647)){_=0;break}P=Ca(S|0)|0;R=(P|0)==((c[T>>2]|0)+(c[Z>>2]|0)|0);$=P;aa=S;ba=R?P:-1;ca=R?S:0;Y=191}}while(0);do{if((Y|0)==182){U=Ca(0)|0;if((U|0)==-1){_=0;break}S=c[64212>>2]|0;R=S+ -1|0;if((R&U|0)==0){da=W}else{da=W-U+(R+U&0-S)|0}S=c[64168>>2]|0;R=S+da|0;if(!(da>>>0>q>>>0&da>>>0<2147483647)){_=0;break}P=c[64176>>2]|0;if((P|0)!=0){if(R>>>0<=S>>>0|R>>>0>P>>>0){_=0;break}}P=Ca(da|0)|0;R=(P|0)==(U|0);$=P;aa=da;ba=R?U:-1;ca=R?da:0;Y=191}}while(0);h:do{if((Y|0)==191){R=0-aa|0;if(!((ba|0)==-1)){ea=ba;fa=ca;Y=202;break f}do{if(($|0)!=-1&aa>>>0<2147483647&aa>>>0<X>>>0){U=c[64216>>2]|0;P=M-aa+U&0-U;if(!(P>>>0<2147483647)){ga=aa;break}if((Ca(P|0)|0)==-1){Ca(R|0)|0;_=ca;break h}else{ga=P+aa|0;break}}else{ga=aa}}while(0);if(($|0)==-1){_=ca}else{ea=$;fa=ga;Y=202;break f}}}while(0);c[64180>>2]=c[64180>>2]|4;ha=_;Y=199}else{ha=0;Y=199}}while(0);do{if((Y|0)==199){if(!(W>>>0<2147483647)){break}_=Ca(W|0)|0;ga=Ca(0)|0;if(!((ga|0)!=-1&(_|0)!=-1&_>>>0<ga>>>0)){break}$=ga-_|0;ga=$>>>0>(q+40|0)>>>0;if(ga){ea=_;fa=ga?$:ha;Y=202}}}while(0);do{if((Y|0)==202){ha=(c[64168>>2]|0)+fa|0;c[64168>>2]=ha;if(ha>>>0>(c[64172>>2]|0)>>>0){c[64172>>2]=ha}ha=c[63760>>2]|0;W=64184|0;i:do{if((ha|0)==0){$=c[63752>>2]|0;if(($|0)==0|ea>>>0<$>>>0){c[63752>>2]=ea}c[64184>>2]=ea;c[64188>>2]=fa;c[64196>>2]=0;c[63772>>2]=c[16052];c[63768>>2]=-1;$=0;do{ga=$<<1;_=63776+(ga<<2)|0;c[63776+(ga+3<<2)>>2]=_;c[63776+(ga+2<<2)>>2]=_;$=$+1|0;}while($>>>0<32);$=ea+8|0;if(($&7|0)==0){ia=0}else{ia=0-$&7}$=fa+ -40-ia|0;c[63760>>2]=ea+ia;c[63748>>2]=$;c[ea+(ia+4)>>2]=$|1;c[ea+(fa+ -36)>>2]=40;c[63764>>2]=c[64224>>2]}else{$=W;while(1){ja=c[$>>2]|0;ka=$+4|0;la=c[ka>>2]|0;if((ea|0)==(ja+la|0)){Y=214;break}_=c[$+8>>2]|0;if((_|0)==0){break}else{$=_}}do{if((Y|0)==214){if((c[$+12>>2]&8|0)!=0){break}if(!(ha>>>0>=ja>>>0&ha>>>0<ea>>>0)){break}c[ka>>2]=la+fa;_=(c[63748>>2]|0)+fa|0;ga=ha+8|0;if((ga&7|0)==0){ma=0}else{ma=0-ga&7}ga=_-ma|0;c[63760>>2]=ha+ma;c[63748>>2]=ga;c[ha+(ma+4)>>2]=ga|1;c[ha+(_+4)>>2]=40;c[63764>>2]=c[64224>>2];break i}}while(0);if(ea>>>0<(c[63752>>2]|0)>>>0){c[63752>>2]=ea}$=ea+fa|0;_=64184|0;while(1){if((c[_>>2]|0)==($|0)){Y=224;break}ga=c[_+8>>2]|0;if((ga|0)==0){break}else{_=ga}}do{if((Y|0)==224){if((c[_+12>>2]&8|0)!=0){break}c[_>>2]=ea;$=_+4|0;c[$>>2]=(c[$>>2]|0)+fa;$=ea+8|0;if(($&7|0)==0){na=0}else{na=0-$&7}$=ea+(fa+8)|0;if(($&7|0)==0){oa=0}else{oa=0-$&7}$=ea+(oa+fa)|0;ga=na+q|0;ca=ea+ga|0;aa=$-(ea+na)-q|0;c[ea+(na+4)>>2]=q|3;j:do{if(($|0)==(c[63760>>2]|0)){M=(c[63748>>2]|0)+aa|0;c[63748>>2]=M;c[63760>>2]=ca;c[ea+(ga+4)>>2]=M|1}else{if(($|0)==(c[63756>>2]|0)){M=(c[63744>>2]|0)+aa|0;c[63744>>2]=M;c[63756>>2]=ca;c[ea+(ga+4)>>2]=M|1;c[ea+(M+ga)>>2]=M;break}M=fa+4|0;X=c[ea+(M+oa)>>2]|0;if((X&3|0)==1){ba=X&-8;da=X>>>3;k:do{if(X>>>0<256){Z=c[ea+((oa|8)+fa)>>2]|0;V=c[ea+(fa+12+oa)>>2]|0;L=63776+(da<<1<<2)|0;do{if((Z|0)!=(L|0)){if(Z>>>0<(c[63752>>2]|0)>>>0){Ta()}if((c[Z+12>>2]|0)==($|0)){break}Ta()}}while(0);if((V|0)==(Z|0)){c[15934]=c[15934]&~(1<<da);break}do{if((V|0)==(L|0)){pa=V+8|0}else{if(V>>>0<(c[63752>>2]|0)>>>0){Ta()}R=V+8|0;if((c[R>>2]|0)==($|0)){pa=R;break}Ta()}}while(0);c[Z+12>>2]=V;c[pa>>2]=Z}else{L=c[ea+((oa|24)+fa)>>2]|0;R=c[ea+(fa+12+oa)>>2]|0;do{if((R|0)==($|0)){T=oa|16;P=ea+(M+T)|0;U=c[P>>2]|0;if((U|0)==0){S=ea+(T+fa)|0;T=c[S>>2]|0;if((T|0)==0){qa=0;break}else{ra=S;sa=T}}else{ra=P;sa=U}while(1){U=sa+20|0;P=c[U>>2]|0;if((P|0)!=0){sa=P;ra=U;continue}U=sa+16|0;P=c[U>>2]|0;if((P|0)==0){break}else{ra=U;sa=P}}if(ra>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[ra>>2]=0;qa=sa;break}}else{P=c[ea+((oa|8)+fa)>>2]|0;if(P>>>0<(c[63752>>2]|0)>>>0){Ta()}U=P+12|0;if((c[U>>2]|0)!=($|0)){Ta()}T=R+8|0;if((c[T>>2]|0)==($|0)){c[U>>2]=R;c[T>>2]=P;qa=R;break}else{Ta()}}}while(0);if((L|0)==0){break}R=c[ea+(fa+28+oa)>>2]|0;Z=64040+(R<<2)|0;do{if(($|0)==(c[Z>>2]|0)){c[Z>>2]=qa;if((qa|0)!=0){break}c[63740>>2]=c[63740>>2]&~(1<<R);break k}else{if(L>>>0<(c[63752>>2]|0)>>>0){Ta()}V=L+16|0;if((c[V>>2]|0)==($|0)){c[V>>2]=qa}else{c[L+20>>2]=qa}if((qa|0)==0){break k}}}while(0);if(qa>>>0<(c[63752>>2]|0)>>>0){Ta()}c[qa+24>>2]=L;R=oa|16;Z=c[ea+(R+fa)>>2]|0;do{if((Z|0)!=0){if(Z>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[qa+16>>2]=Z;c[Z+24>>2]=qa;break}}}while(0);Z=c[ea+(M+R)>>2]|0;if((Z|0)==0){break}if(Z>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[qa+20>>2]=Z;c[Z+24>>2]=qa;break}}}while(0);ta=ea+((ba|oa)+fa)|0;ua=ba+aa|0}else{ta=$;ua=aa}M=ta+4|0;c[M>>2]=c[M>>2]&-2;c[ea+(ga+4)>>2]=ua|1;c[ea+(ua+ga)>>2]=ua;M=ua>>>3;if(ua>>>0<256){da=M<<1;X=63776+(da<<2)|0;Z=c[15934]|0;L=1<<M;do{if((Z&L|0)==0){c[15934]=Z|L;va=X;wa=63776+(da+2<<2)|0}else{M=63776+(da+2<<2)|0;V=c[M>>2]|0;if(!(V>>>0<(c[63752>>2]|0)>>>0)){va=V;wa=M;break}Ta()}}while(0);c[wa>>2]=ca;c[va+12>>2]=ca;c[ea+(ga+8)>>2]=va;c[ea+(ga+12)>>2]=X;break}da=ua>>>8;do{if((da|0)==0){xa=0}else{if(ua>>>0>16777215){xa=31;break}L=(da+1048320|0)>>>16&8;Z=da<<L;ba=(Z+520192|0)>>>16&4;M=Z<<ba;Z=(M+245760|0)>>>16&2;V=14-(ba|L|Z)+(M<<Z>>>15)|0;xa=ua>>>(V+7|0)&1|V<<1}}while(0);da=64040+(xa<<2)|0;c[ea+(ga+28)>>2]=xa;c[ea+(ga+20)>>2]=0;c[ea+(ga+16)>>2]=0;X=c[63740>>2]|0;V=1<<xa;if((X&V|0)==0){c[63740>>2]=X|V;c[da>>2]=ca;c[ea+(ga+24)>>2]=da;c[ea+(ga+12)>>2]=ca;c[ea+(ga+8)>>2]=ca;break}V=c[da>>2]|0;if((xa|0)==31){ya=0}else{ya=25-(xa>>>1)|0}l:do{if((c[V+4>>2]&-8|0)==(ua|0)){za=V}else{da=ua<<ya;X=V;while(1){Aa=X+16+(da>>>31<<2)|0;Z=c[Aa>>2]|0;if((Z|0)==0){break}if((c[Z+4>>2]&-8|0)==(ua|0)){za=Z;break l}else{da=da<<1;X=Z}}if(Aa>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[Aa>>2]=ca;c[ea+(ga+24)>>2]=X;c[ea+(ga+12)>>2]=ca;c[ea+(ga+8)>>2]=ca;break j}}}while(0);V=za+8|0;da=c[V>>2]|0;R=c[63752>>2]|0;if(za>>>0<R>>>0){Ta()}if(da>>>0<R>>>0){Ta()}else{c[da+12>>2]=ca;c[V>>2]=ca;c[ea+(ga+8)>>2]=da;c[ea+(ga+12)>>2]=za;c[ea+(ga+24)>>2]=0;break}}}while(0);p=ea+(na|8)|0;i=b;return p|0}}while(0);_=64184|0;while(1){Ba=c[_>>2]|0;if(!(Ba>>>0>ha>>>0)){Da=c[_+4>>2]|0;Ea=Ba+Da|0;if(Ea>>>0>ha>>>0){break}}_=c[_+8>>2]|0}_=Ba+(Da+ -39)|0;if((_&7|0)==0){Fa=0}else{Fa=0-_&7}_=Ba+(Da+ -47+Fa)|0;ga=_>>>0<(ha+16|0)>>>0?ha:_;_=ga+8|0;ca=ea+8|0;if((ca&7|0)==0){Ha=0}else{Ha=0-ca&7}ca=fa+ -40-Ha|0;c[63760>>2]=ea+Ha;c[63748>>2]=ca;c[ea+(Ha+4)>>2]=ca|1;c[ea+(fa+ -36)>>2]=40;c[63764>>2]=c[64224>>2];c[ga+4>>2]=27;ca=_;aa=64184|0;c[ca+0>>2]=c[aa+0>>2];c[ca+4>>2]=c[aa+4>>2];c[ca+8>>2]=c[aa+8>>2];c[ca+12>>2]=c[aa+12>>2];c[64184>>2]=ea;c[64188>>2]=fa;c[64196>>2]=0;c[64192>>2]=_;_=ga+28|0;c[_>>2]=7;if((ga+32|0)>>>0<Ea>>>0){aa=_;while(1){_=aa+4|0;c[_>>2]=7;if((aa+8|0)>>>0<Ea>>>0){aa=_}else{break}}}if((ga|0)==(ha|0)){break}aa=ga-ha|0;_=ha+(aa+4)|0;c[_>>2]=c[_>>2]&-2;c[ha+4>>2]=aa|1;c[ha+aa>>2]=aa;_=aa>>>3;if(aa>>>0<256){ca=_<<1;$=63776+(ca<<2)|0;t=c[15934]|0;da=1<<_;do{if((t&da|0)==0){c[15934]=t|da;Ia=$;Ja=63776+(ca+2<<2)|0}else{_=63776+(ca+2<<2)|0;V=c[_>>2]|0;if(!(V>>>0<(c[63752>>2]|0)>>>0)){Ia=V;Ja=_;break}Ta()}}while(0);c[Ja>>2]=ha;c[Ia+12>>2]=ha;c[ha+8>>2]=Ia;c[ha+12>>2]=$;break}ca=aa>>>8;do{if((ca|0)==0){Ka=0}else{if(aa>>>0>16777215){Ka=31;break}da=(ca+1048320|0)>>>16&8;t=ca<<da;ga=(t+520192|0)>>>16&4;_=t<<ga;t=(_+245760|0)>>>16&2;V=14-(ga|da|t)+(_<<t>>>15)|0;Ka=aa>>>(V+7|0)&1|V<<1}}while(0);ca=64040+(Ka<<2)|0;c[ha+28>>2]=Ka;c[ha+20>>2]=0;c[ha+16>>2]=0;$=c[63740>>2]|0;V=1<<Ka;if(($&V|0)==0){c[63740>>2]=$|V;c[ca>>2]=ha;c[ha+24>>2]=ca;c[ha+12>>2]=ha;c[ha+8>>2]=ha;break}V=c[ca>>2]|0;if((Ka|0)==31){La=0}else{La=25-(Ka>>>1)|0}m:do{if((c[V+4>>2]&-8|0)==(aa|0)){Ma=V}else{ca=aa<<La;$=V;while(1){Na=$+16+(ca>>>31<<2)|0;t=c[Na>>2]|0;if((t|0)==0){break}if((c[t+4>>2]&-8|0)==(aa|0)){Ma=t;break m}else{ca=ca<<1;$=t}}if(Na>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[Na>>2]=ha;c[ha+24>>2]=$;c[ha+12>>2]=ha;c[ha+8>>2]=ha;break i}}}while(0);aa=Ma+8|0;V=c[aa>>2]|0;ca=c[63752>>2]|0;if(Ma>>>0<ca>>>0){Ta()}if(V>>>0<ca>>>0){Ta()}else{c[V+12>>2]=ha;c[aa>>2]=ha;c[ha+8>>2]=V;c[ha+12>>2]=Ma;c[ha+24>>2]=0;break}}}while(0);ha=c[63748>>2]|0;if(!(ha>>>0>q>>>0)){break}W=ha-q|0;c[63748>>2]=W;ha=c[63760>>2]|0;c[63760>>2]=ha+q;c[ha+(q+4)>>2]=W|1;c[ha+4>>2]=q|3;p=ha+8|0;i=b;return p|0}}while(0);c[(Pa()|0)>>2]=12;p=0;i=b;return p|0}function Ze(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;b=i;if((a|0)==0){i=b;return}d=a+ -8|0;e=c[63752>>2]|0;if(d>>>0<e>>>0){Ta()}f=c[a+ -4>>2]|0;g=f&3;if((g|0)==1){Ta()}h=f&-8;j=a+(h+ -8)|0;a:do{if((f&1|0)==0){k=c[d>>2]|0;if((g|0)==0){i=b;return}l=-8-k|0;m=a+l|0;n=k+h|0;if(m>>>0<e>>>0){Ta()}if((m|0)==(c[63756>>2]|0)){o=a+(h+ -4)|0;if((c[o>>2]&3|0)!=3){p=m;q=n;break}c[63744>>2]=n;c[o>>2]=c[o>>2]&-2;c[a+(l+4)>>2]=n|1;c[j>>2]=n;i=b;return}o=k>>>3;if(k>>>0<256){k=c[a+(l+8)>>2]|0;r=c[a+(l+12)>>2]|0;s=63776+(o<<1<<2)|0;do{if((k|0)!=(s|0)){if(k>>>0<e>>>0){Ta()}if((c[k+12>>2]|0)==(m|0)){break}Ta()}}while(0);if((r|0)==(k|0)){c[15934]=c[15934]&~(1<<o);p=m;q=n;break}do{if((r|0)==(s|0)){t=r+8|0}else{if(r>>>0<e>>>0){Ta()}u=r+8|0;if((c[u>>2]|0)==(m|0)){t=u;break}Ta()}}while(0);c[k+12>>2]=r;c[t>>2]=k;p=m;q=n;break}s=c[a+(l+24)>>2]|0;o=c[a+(l+12)>>2]|0;do{if((o|0)==(m|0)){u=a+(l+20)|0;v=c[u>>2]|0;if((v|0)==0){w=a+(l+16)|0;x=c[w>>2]|0;if((x|0)==0){y=0;break}else{z=w;A=x}}else{z=u;A=v}while(1){v=A+20|0;u=c[v>>2]|0;if((u|0)!=0){A=u;z=v;continue}v=A+16|0;u=c[v>>2]|0;if((u|0)==0){break}else{z=v;A=u}}if(z>>>0<e>>>0){Ta()}else{c[z>>2]=0;y=A;break}}else{u=c[a+(l+8)>>2]|0;if(u>>>0<e>>>0){Ta()}v=u+12|0;if((c[v>>2]|0)!=(m|0)){Ta()}x=o+8|0;if((c[x>>2]|0)==(m|0)){c[v>>2]=o;c[x>>2]=u;y=o;break}else{Ta()}}}while(0);if((s|0)==0){p=m;q=n;break}o=c[a+(l+28)>>2]|0;k=64040+(o<<2)|0;do{if((m|0)==(c[k>>2]|0)){c[k>>2]=y;if((y|0)!=0){break}c[63740>>2]=c[63740>>2]&~(1<<o);p=m;q=n;break a}else{if(s>>>0<(c[63752>>2]|0)>>>0){Ta()}r=s+16|0;if((c[r>>2]|0)==(m|0)){c[r>>2]=y}else{c[s+20>>2]=y}if((y|0)==0){p=m;q=n;break a}}}while(0);if(y>>>0<(c[63752>>2]|0)>>>0){Ta()}c[y+24>>2]=s;o=c[a+(l+16)>>2]|0;do{if((o|0)!=0){if(o>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[y+16>>2]=o;c[o+24>>2]=y;break}}}while(0);o=c[a+(l+20)>>2]|0;if((o|0)==0){p=m;q=n;break}if(o>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[y+20>>2]=o;c[o+24>>2]=y;p=m;q=n;break}}else{p=d;q=h}}while(0);if(!(p>>>0<j>>>0)){Ta()}d=a+(h+ -4)|0;y=c[d>>2]|0;if((y&1|0)==0){Ta()}do{if((y&2|0)==0){if((j|0)==(c[63760>>2]|0)){e=(c[63748>>2]|0)+q|0;c[63748>>2]=e;c[63760>>2]=p;c[p+4>>2]=e|1;if((p|0)!=(c[63756>>2]|0)){i=b;return}c[63756>>2]=0;c[63744>>2]=0;i=b;return}if((j|0)==(c[63756>>2]|0)){e=(c[63744>>2]|0)+q|0;c[63744>>2]=e;c[63756>>2]=p;c[p+4>>2]=e|1;c[p+e>>2]=e;i=b;return}e=(y&-8)+q|0;A=y>>>3;b:do{if(y>>>0<256){z=c[a+h>>2]|0;t=c[a+(h|4)>>2]|0;g=63776+(A<<1<<2)|0;do{if((z|0)!=(g|0)){if(z>>>0<(c[63752>>2]|0)>>>0){Ta()}if((c[z+12>>2]|0)==(j|0)){break}Ta()}}while(0);if((t|0)==(z|0)){c[15934]=c[15934]&~(1<<A);break}do{if((t|0)==(g|0)){B=t+8|0}else{if(t>>>0<(c[63752>>2]|0)>>>0){Ta()}f=t+8|0;if((c[f>>2]|0)==(j|0)){B=f;break}Ta()}}while(0);c[z+12>>2]=t;c[B>>2]=z}else{g=c[a+(h+16)>>2]|0;f=c[a+(h|4)>>2]|0;do{if((f|0)==(j|0)){o=a+(h+12)|0;s=c[o>>2]|0;if((s|0)==0){k=a+(h+8)|0;r=c[k>>2]|0;if((r|0)==0){C=0;break}else{D=r;E=k}}else{D=s;E=o}while(1){o=D+20|0;s=c[o>>2]|0;if((s|0)!=0){E=o;D=s;continue}s=D+16|0;o=c[s>>2]|0;if((o|0)==0){break}else{D=o;E=s}}if(E>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[E>>2]=0;C=D;break}}else{s=c[a+h>>2]|0;if(s>>>0<(c[63752>>2]|0)>>>0){Ta()}o=s+12|0;if((c[o>>2]|0)!=(j|0)){Ta()}k=f+8|0;if((c[k>>2]|0)==(j|0)){c[o>>2]=f;c[k>>2]=s;C=f;break}else{Ta()}}}while(0);if((g|0)==0){break}f=c[a+(h+20)>>2]|0;z=64040+(f<<2)|0;do{if((j|0)==(c[z>>2]|0)){c[z>>2]=C;if((C|0)!=0){break}c[63740>>2]=c[63740>>2]&~(1<<f);break b}else{if(g>>>0<(c[63752>>2]|0)>>>0){Ta()}t=g+16|0;if((c[t>>2]|0)==(j|0)){c[t>>2]=C}else{c[g+20>>2]=C}if((C|0)==0){break b}}}while(0);if(C>>>0<(c[63752>>2]|0)>>>0){Ta()}c[C+24>>2]=g;f=c[a+(h+8)>>2]|0;do{if((f|0)!=0){if(f>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[C+16>>2]=f;c[f+24>>2]=C;break}}}while(0);f=c[a+(h+12)>>2]|0;if((f|0)==0){break}if(f>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[C+20>>2]=f;c[f+24>>2]=C;break}}}while(0);c[p+4>>2]=e|1;c[p+e>>2]=e;if((p|0)!=(c[63756>>2]|0)){F=e;break}c[63744>>2]=e;i=b;return}else{c[d>>2]=y&-2;c[p+4>>2]=q|1;c[p+q>>2]=q;F=q}}while(0);q=F>>>3;if(F>>>0<256){y=q<<1;d=63776+(y<<2)|0;C=c[15934]|0;h=1<<q;do{if((C&h|0)==0){c[15934]=C|h;G=d;H=63776+(y+2<<2)|0}else{q=63776+(y+2<<2)|0;a=c[q>>2]|0;if(!(a>>>0<(c[63752>>2]|0)>>>0)){G=a;H=q;break}Ta()}}while(0);c[H>>2]=p;c[G+12>>2]=p;c[p+8>>2]=G;c[p+12>>2]=d;i=b;return}d=F>>>8;do{if((d|0)==0){I=0}else{if(F>>>0>16777215){I=31;break}G=(d+1048320|0)>>>16&8;H=d<<G;y=(H+520192|0)>>>16&4;h=H<<y;H=(h+245760|0)>>>16&2;C=14-(y|G|H)+(h<<H>>>15)|0;I=F>>>(C+7|0)&1|C<<1}}while(0);d=64040+(I<<2)|0;c[p+28>>2]=I;c[p+20>>2]=0;c[p+16>>2]=0;C=c[63740>>2]|0;H=1<<I;c:do{if((C&H|0)==0){c[63740>>2]=C|H;c[d>>2]=p;c[p+24>>2]=d;c[p+12>>2]=p;c[p+8>>2]=p}else{h=c[d>>2]|0;if((I|0)==31){J=0}else{J=25-(I>>>1)|0}d:do{if((c[h+4>>2]&-8|0)==(F|0)){K=h}else{G=F<<J;y=h;while(1){L=y+16+(G>>>31<<2)|0;q=c[L>>2]|0;if((q|0)==0){break}if((c[q+4>>2]&-8|0)==(F|0)){K=q;break d}else{G=G<<1;y=q}}if(L>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[L>>2]=p;c[p+24>>2]=y;c[p+12>>2]=p;c[p+8>>2]=p;break c}}}while(0);h=K+8|0;e=c[h>>2]|0;G=c[63752>>2]|0;if(K>>>0<G>>>0){Ta()}if(e>>>0<G>>>0){Ta()}else{c[e+12>>2]=p;c[h>>2]=p;c[p+8>>2]=e;c[p+12>>2]=K;c[p+24>>2]=0;break}}}while(0);p=(c[63768>>2]|0)+ -1|0;c[63768>>2]=p;if((p|0)==0){M=64192|0}else{i=b;return}while(1){p=c[M>>2]|0;if((p|0)==0){break}else{M=p+8|0}}c[63768>>2]=-1;i=b;return}function _e(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;do{if((a|0)==0){e=0}else{f=$(b,a)|0;if(!((b|a)>>>0>65535)){e=f;break}e=((f>>>0)/(a>>>0)|0|0)==(b|0)?f:-1}}while(0);b=Ye(e)|0;if((b|0)==0){i=d;return b|0}if((c[b+ -4>>2]&3|0)==0){i=d;return b|0}hf(b|0,0,e|0)|0;i=d;return b|0}function $e(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;if((a|0)==0){e=Ye(b)|0;i=d;return e|0}if(b>>>0>4294967231){c[(Pa()|0)>>2]=12;e=0;i=d;return e|0}if(b>>>0<11){f=16}else{f=b+11&-8}g=af(a+ -8|0,f)|0;if((g|0)!=0){e=g+8|0;i=d;return e|0}g=Ye(b)|0;if((g|0)==0){e=0;i=d;return e|0}f=c[a+ -4>>2]|0;h=(f&-8)-((f&3|0)==0?8:4)|0;ff(g|0,a|0,(h>>>0<b>>>0?h:b)|0)|0;Ze(a);e=g;i=d;return e|0}function af(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;d=i;e=a+4|0;f=c[e>>2]|0;g=f&-8;h=a+g|0;j=c[63752>>2]|0;if(a>>>0<j>>>0){Ta()}k=f&3;if(!((k|0)!=1&a>>>0<h>>>0)){Ta()}l=a+(g|4)|0;m=c[l>>2]|0;if((m&1|0)==0){Ta()}if((k|0)==0){if(b>>>0<256){n=0;i=d;return n|0}do{if(!(g>>>0<(b+4|0)>>>0)){if((g-b|0)>>>0>c[64216>>2]<<1>>>0){break}else{n=a}i=d;return n|0}}while(0);n=0;i=d;return n|0}if(!(g>>>0<b>>>0)){k=g-b|0;if(!(k>>>0>15)){n=a;i=d;return n|0}c[e>>2]=f&1|b|2;c[a+(b+4)>>2]=k|3;c[l>>2]=c[l>>2]|1;bf(a+b|0,k);n=a;i=d;return n|0}if((h|0)==(c[63760>>2]|0)){k=(c[63748>>2]|0)+g|0;if(!(k>>>0>b>>>0)){n=0;i=d;return n|0}l=k-b|0;c[e>>2]=f&1|b|2;c[a+(b+4)>>2]=l|1;c[63760>>2]=a+b;c[63748>>2]=l;n=a;i=d;return n|0}if((h|0)==(c[63756>>2]|0)){l=(c[63744>>2]|0)+g|0;if(l>>>0<b>>>0){n=0;i=d;return n|0}k=l-b|0;if(k>>>0>15){c[e>>2]=f&1|b|2;c[a+(b+4)>>2]=k|1;c[a+l>>2]=k;o=a+(l+4)|0;c[o>>2]=c[o>>2]&-2;p=a+b|0;q=k}else{c[e>>2]=f&1|l|2;f=a+(l+4)|0;c[f>>2]=c[f>>2]|1;p=0;q=0}c[63744>>2]=q;c[63756>>2]=p;n=a;i=d;return n|0}if((m&2|0)!=0){n=0;i=d;return n|0}p=(m&-8)+g|0;if(p>>>0<b>>>0){n=0;i=d;return n|0}q=p-b|0;f=m>>>3;a:do{if(m>>>0<256){l=c[a+(g+8)>>2]|0;k=c[a+(g+12)>>2]|0;o=63776+(f<<1<<2)|0;do{if((l|0)!=(o|0)){if(l>>>0<j>>>0){Ta()}if((c[l+12>>2]|0)==(h|0)){break}Ta()}}while(0);if((k|0)==(l|0)){c[15934]=c[15934]&~(1<<f);break}do{if((k|0)==(o|0)){r=k+8|0}else{if(k>>>0<j>>>0){Ta()}s=k+8|0;if((c[s>>2]|0)==(h|0)){r=s;break}Ta()}}while(0);c[l+12>>2]=k;c[r>>2]=l}else{o=c[a+(g+24)>>2]|0;s=c[a+(g+12)>>2]|0;do{if((s|0)==(h|0)){t=a+(g+20)|0;u=c[t>>2]|0;if((u|0)==0){v=a+(g+16)|0;w=c[v>>2]|0;if((w|0)==0){x=0;break}else{y=v;z=w}}else{y=t;z=u}while(1){u=z+20|0;t=c[u>>2]|0;if((t|0)!=0){z=t;y=u;continue}u=z+16|0;t=c[u>>2]|0;if((t|0)==0){break}else{y=u;z=t}}if(y>>>0<j>>>0){Ta()}else{c[y>>2]=0;x=z;break}}else{t=c[a+(g+8)>>2]|0;if(t>>>0<j>>>0){Ta()}u=t+12|0;if((c[u>>2]|0)!=(h|0)){Ta()}w=s+8|0;if((c[w>>2]|0)==(h|0)){c[u>>2]=s;c[w>>2]=t;x=s;break}else{Ta()}}}while(0);if((o|0)==0){break}s=c[a+(g+28)>>2]|0;l=64040+(s<<2)|0;do{if((h|0)==(c[l>>2]|0)){c[l>>2]=x;if((x|0)!=0){break}c[63740>>2]=c[63740>>2]&~(1<<s);break a}else{if(o>>>0<(c[63752>>2]|0)>>>0){Ta()}k=o+16|0;if((c[k>>2]|0)==(h|0)){c[k>>2]=x}else{c[o+20>>2]=x}if((x|0)==0){break a}}}while(0);if(x>>>0<(c[63752>>2]|0)>>>0){Ta()}c[x+24>>2]=o;s=c[a+(g+16)>>2]|0;do{if((s|0)!=0){if(s>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[x+16>>2]=s;c[s+24>>2]=x;break}}}while(0);s=c[a+(g+20)>>2]|0;if((s|0)==0){break}if(s>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[x+20>>2]=s;c[s+24>>2]=x;break}}}while(0);if(q>>>0<16){c[e>>2]=p|c[e>>2]&1|2;x=a+(p|4)|0;c[x>>2]=c[x>>2]|1;n=a;i=d;return n|0}else{c[e>>2]=c[e>>2]&1|b|2;c[a+(b+4)>>2]=q|3;e=a+(p|4)|0;c[e>>2]=c[e>>2]|1;bf(a+b|0,q);n=a;i=d;return n|0}return 0}function bf(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0;d=i;e=a+b|0;f=c[a+4>>2]|0;a:do{if((f&1|0)==0){g=c[a>>2]|0;if((f&3|0)==0){i=d;return}h=a+(0-g)|0;j=g+b|0;k=c[63752>>2]|0;if(h>>>0<k>>>0){Ta()}if((h|0)==(c[63756>>2]|0)){l=a+(b+4)|0;if((c[l>>2]&3|0)!=3){m=h;n=j;break}c[63744>>2]=j;c[l>>2]=c[l>>2]&-2;c[a+(4-g)>>2]=j|1;c[e>>2]=j;i=d;return}l=g>>>3;if(g>>>0<256){o=c[a+(8-g)>>2]|0;p=c[a+(12-g)>>2]|0;q=63776+(l<<1<<2)|0;do{if((o|0)!=(q|0)){if(o>>>0<k>>>0){Ta()}if((c[o+12>>2]|0)==(h|0)){break}Ta()}}while(0);if((p|0)==(o|0)){c[15934]=c[15934]&~(1<<l);m=h;n=j;break}do{if((p|0)==(q|0)){r=p+8|0}else{if(p>>>0<k>>>0){Ta()}s=p+8|0;if((c[s>>2]|0)==(h|0)){r=s;break}Ta()}}while(0);c[o+12>>2]=p;c[r>>2]=o;m=h;n=j;break}q=c[a+(24-g)>>2]|0;l=c[a+(12-g)>>2]|0;do{if((l|0)==(h|0)){s=16-g|0;t=a+(s+4)|0;u=c[t>>2]|0;if((u|0)==0){v=a+s|0;s=c[v>>2]|0;if((s|0)==0){w=0;break}else{x=v;y=s}}else{x=t;y=u}while(1){u=y+20|0;t=c[u>>2]|0;if((t|0)!=0){y=t;x=u;continue}u=y+16|0;t=c[u>>2]|0;if((t|0)==0){break}else{x=u;y=t}}if(x>>>0<k>>>0){Ta()}else{c[x>>2]=0;w=y;break}}else{t=c[a+(8-g)>>2]|0;if(t>>>0<k>>>0){Ta()}u=t+12|0;if((c[u>>2]|0)!=(h|0)){Ta()}s=l+8|0;if((c[s>>2]|0)==(h|0)){c[u>>2]=l;c[s>>2]=t;w=l;break}else{Ta()}}}while(0);if((q|0)==0){m=h;n=j;break}l=c[a+(28-g)>>2]|0;k=64040+(l<<2)|0;do{if((h|0)==(c[k>>2]|0)){c[k>>2]=w;if((w|0)!=0){break}c[63740>>2]=c[63740>>2]&~(1<<l);m=h;n=j;break a}else{if(q>>>0<(c[63752>>2]|0)>>>0){Ta()}o=q+16|0;if((c[o>>2]|0)==(h|0)){c[o>>2]=w}else{c[q+20>>2]=w}if((w|0)==0){m=h;n=j;break a}}}while(0);if(w>>>0<(c[63752>>2]|0)>>>0){Ta()}c[w+24>>2]=q;l=16-g|0;k=c[a+l>>2]|0;do{if((k|0)!=0){if(k>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[w+16>>2]=k;c[k+24>>2]=w;break}}}while(0);k=c[a+(l+4)>>2]|0;if((k|0)==0){m=h;n=j;break}if(k>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[w+20>>2]=k;c[k+24>>2]=w;m=h;n=j;break}}else{m=a;n=b}}while(0);w=c[63752>>2]|0;if(e>>>0<w>>>0){Ta()}y=a+(b+4)|0;x=c[y>>2]|0;do{if((x&2|0)==0){if((e|0)==(c[63760>>2]|0)){r=(c[63748>>2]|0)+n|0;c[63748>>2]=r;c[63760>>2]=m;c[m+4>>2]=r|1;if((m|0)!=(c[63756>>2]|0)){i=d;return}c[63756>>2]=0;c[63744>>2]=0;i=d;return}if((e|0)==(c[63756>>2]|0)){r=(c[63744>>2]|0)+n|0;c[63744>>2]=r;c[63756>>2]=m;c[m+4>>2]=r|1;c[m+r>>2]=r;i=d;return}r=(x&-8)+n|0;f=x>>>3;b:do{if(x>>>0<256){k=c[a+(b+8)>>2]|0;g=c[a+(b+12)>>2]|0;q=63776+(f<<1<<2)|0;do{if((k|0)!=(q|0)){if(k>>>0<w>>>0){Ta()}if((c[k+12>>2]|0)==(e|0)){break}Ta()}}while(0);if((g|0)==(k|0)){c[15934]=c[15934]&~(1<<f);break}do{if((g|0)==(q|0)){z=g+8|0}else{if(g>>>0<w>>>0){Ta()}o=g+8|0;if((c[o>>2]|0)==(e|0)){z=o;break}Ta()}}while(0);c[k+12>>2]=g;c[z>>2]=k}else{q=c[a+(b+24)>>2]|0;o=c[a+(b+12)>>2]|0;do{if((o|0)==(e|0)){p=a+(b+20)|0;t=c[p>>2]|0;if((t|0)==0){s=a+(b+16)|0;u=c[s>>2]|0;if((u|0)==0){A=0;break}else{B=u;C=s}}else{B=t;C=p}while(1){p=B+20|0;t=c[p>>2]|0;if((t|0)!=0){C=p;B=t;continue}t=B+16|0;p=c[t>>2]|0;if((p|0)==0){break}else{B=p;C=t}}if(C>>>0<w>>>0){Ta()}else{c[C>>2]=0;A=B;break}}else{t=c[a+(b+8)>>2]|0;if(t>>>0<w>>>0){Ta()}p=t+12|0;if((c[p>>2]|0)!=(e|0)){Ta()}s=o+8|0;if((c[s>>2]|0)==(e|0)){c[p>>2]=o;c[s>>2]=t;A=o;break}else{Ta()}}}while(0);if((q|0)==0){break}o=c[a+(b+28)>>2]|0;k=64040+(o<<2)|0;do{if((e|0)==(c[k>>2]|0)){c[k>>2]=A;if((A|0)!=0){break}c[63740>>2]=c[63740>>2]&~(1<<o);break b}else{if(q>>>0<(c[63752>>2]|0)>>>0){Ta()}g=q+16|0;if((c[g>>2]|0)==(e|0)){c[g>>2]=A}else{c[q+20>>2]=A}if((A|0)==0){break b}}}while(0);if(A>>>0<(c[63752>>2]|0)>>>0){Ta()}c[A+24>>2]=q;o=c[a+(b+16)>>2]|0;do{if((o|0)!=0){if(o>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[A+16>>2]=o;c[o+24>>2]=A;break}}}while(0);o=c[a+(b+20)>>2]|0;if((o|0)==0){break}if(o>>>0<(c[63752>>2]|0)>>>0){Ta()}else{c[A+20>>2]=o;c[o+24>>2]=A;break}}}while(0);c[m+4>>2]=r|1;c[m+r>>2]=r;if((m|0)!=(c[63756>>2]|0)){D=r;break}c[63744>>2]=r;i=d;return}else{c[y>>2]=x&-2;c[m+4>>2]=n|1;c[m+n>>2]=n;D=n}}while(0);n=D>>>3;if(D>>>0<256){x=n<<1;y=63776+(x<<2)|0;A=c[15934]|0;b=1<<n;do{if((A&b|0)==0){c[15934]=A|b;E=y;F=63776+(x+2<<2)|0}else{n=63776+(x+2<<2)|0;a=c[n>>2]|0;if(!(a>>>0<(c[63752>>2]|0)>>>0)){E=a;F=n;break}Ta()}}while(0);c[F>>2]=m;c[E+12>>2]=m;c[m+8>>2]=E;c[m+12>>2]=y;i=d;return}y=D>>>8;do{if((y|0)==0){G=0}else{if(D>>>0>16777215){G=31;break}E=(y+1048320|0)>>>16&8;F=y<<E;x=(F+520192|0)>>>16&4;b=F<<x;F=(b+245760|0)>>>16&2;A=14-(x|E|F)+(b<<F>>>15)|0;G=D>>>(A+7|0)&1|A<<1}}while(0);y=64040+(G<<2)|0;c[m+28>>2]=G;c[m+20>>2]=0;c[m+16>>2]=0;A=c[63740>>2]|0;F=1<<G;if((A&F|0)==0){c[63740>>2]=A|F;c[y>>2]=m;c[m+24>>2]=y;c[m+12>>2]=m;c[m+8>>2]=m;i=d;return}F=c[y>>2]|0;if((G|0)==31){H=0}else{H=25-(G>>>1)|0}c:do{if((c[F+4>>2]&-8|0)==(D|0)){I=F}else{G=D<<H;y=F;while(1){J=y+16+(G>>>31<<2)|0;A=c[J>>2]|0;if((A|0)==0){break}if((c[A+4>>2]&-8|0)==(D|0)){I=A;break c}else{G=G<<1;y=A}}if(J>>>0<(c[63752>>2]|0)>>>0){Ta()}c[J>>2]=m;c[m+24>>2]=y;c[m+12>>2]=m;c[m+8>>2]=m;i=d;return}}while(0);J=I+8|0;D=c[J>>2]|0;F=c[63752>>2]|0;if(I>>>0<F>>>0){Ta()}if(D>>>0<F>>>0){Ta()}c[D+12>>2]=m;c[J>>2]=m;c[m+8>>2]=D;c[m+12>>2]=I;c[m+24>>2]=0;i=d;return}function cf(a,b){a=+a;b=b|0;var d=0,e=0.0,f=0,g=0,j=0.0;d=i;do{if((b|0)>1023){e=a*8.98846567431158e+307;f=b+ -1023|0;if((f|0)<=1023){g=f;j=e;break}f=b+ -2046|0;g=(f|0)>1023?1023:f;j=e*8.98846567431158e+307}else{if(!((b|0)<-1022)){g=b;j=a;break}e=a*1.2882297539194267e-231;f=b+1022|0;if(!((f|0)<-1022)){g=f;j=e;break}f=b+2044|0;g=(f|0)<-1022?-1022:f;j=e*1.2882297539194267e-231}}while(0);b=jf(g+1023|0,0,52)|0;g=D;c[k>>2]=b;c[k+4>>2]=g;a=j*+h[k>>3];i=d;return+a}function df(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;if((d|0)==0){f=0;i=e;return f|0}else{g=d;h=b;j=c}while(1){k=a[h]|0;l=a[j]|0;if(!(k<<24>>24==l<<24>>24)){break}c=g+ -1|0;if((c|0)==0){f=0;m=5;break}else{g=c;h=h+1|0;j=j+1|0}}if((m|0)==5){i=e;return f|0}f=(k&255)-(l&255)|0;i=e;return f|0}function ef(){}function ff(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;if((e|0)>=4096)return Ea(b|0,d|0,e|0)|0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}function gf(b,c,d){b=b|0;c=c|0;d=d|0;var e=0;if((c|0)<(b|0)&(b|0)<(c+d|0)){e=b;c=c+d|0;b=b+d|0;while((d|0)>0){b=b-1|0;c=c-1|0;d=d-1|0;a[b]=a[c]|0}b=e}else{ff(b,c,d)|0}return b|0}function hf(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=b+e|0;if((e|0)>=20){d=d&255;g=b&3;h=d|d<<8|d<<16|d<<24;i=f&~3;if(g){g=b+4-g|0;while((b|0)<(g|0)){a[b]=d;b=b+1|0}}while((b|0)<(i|0)){c[b>>2]=h;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}return b-e|0}function jf(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){D=b<<c|(a&(1<<c)-1<<32-c)>>>32-c;return a<<c}D=a<<c-32;return 0}function kf(b){b=b|0;var c=0;c=b;while(a[c]|0){c=c+1|0}return c-b|0}function lf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=b-d>>>0;e=b-d-(c>>>0>a>>>0|0)>>>0;return(D=e,a-c>>>0|0)|0}function mf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=a+c>>>0;return(D=b+d+(e>>>0<a>>>0|0)>>>0,e|0)|0}function nf(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){D=b>>c;return a>>>c|(b&(1<<c)-1)<<32-c}D=(b|0)<0?-1:0;return b>>c-32|0}function of(a,b,c){a=a|0;b=b|0;c=c|0;if((c|0)<32){D=b>>>c;return a>>>c|(b&(1<<c)-1)<<32-c}D=0;return b>>>c-32|0}function pf(b){b=b|0;var c=0;c=a[n+(b>>>24)|0]|0;if((c|0)<8)return c|0;c=a[n+(b>>16&255)|0]|0;if((c|0)<8)return c+8|0;c=a[n+(b>>8&255)|0]|0;if((c|0)<8)return c+16|0;return(a[n+(b&255)|0]|0)+24|0}function qf(b){b=b|0;var c=0;c=a[m+(b&255)|0]|0;if((c|0)<8)return c|0;c=a[m+(b>>8&255)|0]|0;if((c|0)<8)return c+8|0;c=a[m+(b>>16&255)|0]|0;if((c|0)<8)return c+16|0;return(a[m+(b>>>24)|0]|0)+24|0}function rf(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;c=a&65535;d=b&65535;e=$(d,c)|0;f=a>>>16;a=(e>>>16)+($(d,f)|0)|0;d=b>>>16;b=$(d,c)|0;return(D=(a>>>16)+($(d,f)|0)+(((a&65535)+b|0)>>>16)|0,a+b<<16|e&65535|0)|0}function sf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;e=b>>31|((b|0)<0?-1:0)<<1;f=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;g=d>>31|((d|0)<0?-1:0)<<1;h=((d|0)<0?-1:0)>>31|((d|0)<0?-1:0)<<1;i=lf(e^a,f^b,e,f)|0;b=D;a=g^e;e=h^f;f=lf((xf(i,b,lf(g^c,h^d,g,h)|0,D,0)|0)^a,D^e,a,e)|0;return(D=D,f)|0}function tf(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0;f=i;i=i+8|0;g=f|0;h=b>>31|((b|0)<0?-1:0)<<1;j=((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1;k=e>>31|((e|0)<0?-1:0)<<1;l=((e|0)<0?-1:0)>>31|((e|0)<0?-1:0)<<1;m=lf(h^a,j^b,h,j)|0;b=D;xf(m,b,lf(k^d,l^e,k,l)|0,D,g)|0;l=lf(c[g>>2]^h,c[g+4>>2]^j,h,j)|0;j=D;i=f;return(D=j,l)|0}function uf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=a;a=c;c=rf(e,a)|0;f=D;return(D=($(b,a)|0)+($(d,e)|0)+f|f&0,c|0|0)|0}function vf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=xf(a,b,c,d,0)|0;return(D=D,e)|0}function wf(a,b,d,e){a=a|0;b=b|0;d=d|0;e=e|0;var f=0,g=0;f=i;i=i+8|0;g=f|0;xf(a,b,d,e,g)|0;i=f;return(D=c[g+4>>2]|0,c[g>>2]|0)|0}function xf(a,b,d,e,f){a=a|0;b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0;g=a;h=b;i=h;j=d;k=e;l=k;if((i|0)==0){m=(f|0)!=0;if((l|0)==0){if(m){c[f>>2]=(g>>>0)%(j>>>0);c[f+4>>2]=0}n=0;o=(g>>>0)/(j>>>0)>>>0;return(D=n,o)|0}else{if(!m){n=0;o=0;return(D=n,o)|0}c[f>>2]=a|0;c[f+4>>2]=b&0;n=0;o=0;return(D=n,o)|0}}m=(l|0)==0;do{if((j|0)==0){if(m){if((f|0)!=0){c[f>>2]=(i>>>0)%(j>>>0);c[f+4>>2]=0}n=0;o=(i>>>0)/(j>>>0)>>>0;return(D=n,o)|0}if((g|0)==0){if((f|0)!=0){c[f>>2]=0;c[f+4>>2]=(i>>>0)%(l>>>0)}n=0;o=(i>>>0)/(l>>>0)>>>0;return(D=n,o)|0}p=l-1|0;if((p&l|0)==0){if((f|0)!=0){c[f>>2]=a|0;c[f+4>>2]=p&i|b&0}n=0;o=i>>>((qf(l|0)|0)>>>0);return(D=n,o)|0}p=(pf(l|0)|0)-(pf(i|0)|0)|0;if(p>>>0<=30){q=p+1|0;r=31-p|0;s=q;t=i<<r|g>>>(q>>>0);u=i>>>(q>>>0);v=0;w=g<<r;break}if((f|0)==0){n=0;o=0;return(D=n,o)|0}c[f>>2]=a|0;c[f+4>>2]=h|b&0;n=0;o=0;return(D=n,o)|0}else{if(!m){r=(pf(l|0)|0)-(pf(i|0)|0)|0;if(r>>>0<=31){q=r+1|0;p=31-r|0;x=r-31>>31;s=q;t=g>>>(q>>>0)&x|i<<p;u=i>>>(q>>>0)&x;v=0;w=g<<p;break}if((f|0)==0){n=0;o=0;return(D=n,o)|0}c[f>>2]=a|0;c[f+4>>2]=h|b&0;n=0;o=0;return(D=n,o)|0}p=j-1|0;if((p&j|0)!=0){x=(pf(j|0)|0)+33-(pf(i|0)|0)|0;q=64-x|0;r=32-x|0;y=r>>31;z=x-32|0;A=z>>31;s=x;t=r-1>>31&i>>>(z>>>0)|(i<<r|g>>>(x>>>0))&A;u=A&i>>>(x>>>0);v=g<<q&y;w=(i<<q|g>>>(z>>>0))&y|g<<r&x-33>>31;break}if((f|0)!=0){c[f>>2]=p&g;c[f+4>>2]=0}if((j|0)==1){n=h|b&0;o=a|0|0;return(D=n,o)|0}else{p=qf(j|0)|0;n=i>>>(p>>>0)|0;o=i<<32-p|g>>>(p>>>0)|0;return(D=n,o)|0}}}while(0);if((s|0)==0){B=w;C=v;E=u;F=t;G=0;H=0}else{g=d|0|0;d=k|e&0;e=mf(g,d,-1,-1)|0;k=D;i=w;w=v;v=u;u=t;t=s;s=0;while(1){I=w>>>31|i<<1;J=s|w<<1;j=u<<1|i>>>31|0;a=u>>>31|v<<1|0;lf(e,k,j,a)|0;b=D;h=b>>31|((b|0)<0?-1:0)<<1;K=h&1;L=lf(j,a,h&g,(((b|0)<0?-1:0)>>31|((b|0)<0?-1:0)<<1)&d)|0;M=D;b=t-1|0;if((b|0)==0){break}else{i=I;w=J;v=M;u=L;t=b;s=K}}B=I;C=J;E=M;F=L;G=0;H=K}K=C;C=0;if((f|0)!=0){c[f>>2]=F;c[f+4>>2]=E}n=(K|0)>>>31|(B|C)<<1|(C<<1|K>>>31)&0|G;o=(K<<1|0>>>31)&-2|H;return(D=n,o)|0}function yf(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return db[a&7](b|0,c|0,d|0,e|0)|0}function zf(a,b){a=a|0;b=b|0;eb[a&15](b|0)}function Af(a,b,c){a=a|0;b=b|0;c=c|0;fb[a&7](b|0,c|0)}function Bf(a,b){a=a|0;b=b|0;return gb[a&1](b|0)|0}function Cf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;hb[a&1](b|0,c|0,d|0)}function Df(a,b,c,d,e,f,g,h,i){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;return ib[a&3](b|0,c|0,d|0,e|0,f|0,g|0,h|0,i|0)|0}function Ef(a,b,c){a=a|0;b=b|0;c=c|0;return jb[a&15](b|0,c|0)|0}function Ff(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;return kb[a&7](b|0,c|0,d|0,e|0,f|0)|0}function Gf(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;lb[a&7](b|0,c|0,d|0,e|0)}function Hf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;aa(0);return 0}function If(a){a=a|0;aa(1)}function Jf(a){a=a|0;za(a|0)}function Kf(a){a=a|0;Ma(a|0)}function Lf(a,b){a=a|0;b=b|0;aa(2)}function Mf(a){a=a|0;aa(3);return 0}function Nf(a,b,c){a=a|0;b=b|0;c=c|0;aa(4)}function Of(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;aa(5);return 0}function Pf(a,b){a=a|0;b=b|0;aa(6);return 0}function Qf(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;aa(7);return 0}function Rf(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;aa(8)}
// EMSCRIPTEN_END_FUNCS
var db=[Hf,Ed,Pd,vd,wd,Hf,Hf,Hf];var eb=[If,Lc,Mc,Bd,Cd,Md,Nd,Ud,Jf,Kf,If,If,If,If,If,If];var fb=[Lf,Nc,Jd,Be,Ce,De,Ee,Lf];var gb=[Mf,Vd];var hb=[Nf,Sd];var ib=[Of,Sc,Xc,Of];var jb=[Pf,Oc,Pc,zd,Ad,Dd,Kd,Ld,Od,Td,Wd,Jc,fd,Qd,Pf,Pf];var kb=[Qf,Qc,Uc,Vc,Wc,Yc,Qf,Qf];var lb=[Rf,Ne,Oe,Pe,Qe,Rf,Rf,Rf];return{_strlen:kf,_bitshift64Ashr:nf,_OgvJsDecodeFrame:Kb,_memset:hf,_bitshift64Lshr:of,_OgvJsReceiveInput:Mb,_i64Add:mf,_memmove:gf,_realloc:$e,_i64Subtract:lf,_OgvJsDestroy:Ob,_malloc:Ye,_free:Ze,_memcpy:ff,_calloc:_e,_OgvJsInit:Jb,_OgvJsDecodeAudio:Lb,_OgvJsProcess:Nb,_bitshift64Shl:jf,runPostSets:ef,stackAlloc:mb,stackSave:nb,stackRestore:ob,setThrew:pb,setTempRet0:sb,setTempRet1:tb,setTempRet2:ub,setTempRet3:vb,setTempRet4:wb,setTempRet5:xb,setTempRet6:yb,setTempRet7:zb,setTempRet8:Ab,setTempRet9:Bb,dynCall_iiiii:yf,dynCall_vi:zf,dynCall_vii:Af,dynCall_ii:Bf,dynCall_viii:Cf,dynCall_iiiiiiiii:Df,dynCall_iii:Ef,dynCall_iiiiii:Ff,dynCall_viiii:Gf}})
// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_iiiii": invoke_iiiii, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_ii": invoke_ii, "invoke_viii": invoke_viii, "invoke_iiiiiiiii": invoke_iiiiiiiii, "invoke_iii": invoke_iii, "invoke_iiiiii": invoke_iiiiii, "invoke_viiii": invoke_viiii, "_sin": _sin, "_exp": _exp, "_send": _send, "_pow": _pow, "_memchr": _memchr, "___setErrNo": ___setErrNo, "_OgvJsInitAudio": _OgvJsInitAudio, "_floor": _floor, "_fflush": _fflush, "_OgvJsInitVideo": _OgvJsInitVideo, "_pwrite": _pwrite, "_OgvJsOutputFrameReady": _OgvJsOutputFrameReady, "__reallyNegative": __reallyNegative, "_fabsf": _fabsf, "_sbrk": _sbrk, "_cos": _cos, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_fileno": _fileno, "_sysconf": _sysconf, "__formatString": __formatString, "_atan": _atan, "_rint": _rint, "_puts": _puts, "_printf": _printf, "_OgvJsOutputAudioReady": _OgvJsOutputAudioReady, "_log": _log, "_write": _write, "___errno_location": ___errno_location, "_fputc": _fputc, "_mkport": _mkport, "__exit": __exit, "_abort": _abort, "_fwrite": _fwrite, "_time": _time, "_fprintf": _fprintf, "_ceil": _ceil, "_qsort": _qsort, "_fputs": _fputs, "_sqrt": _sqrt, "_exit": _exit, "_OgvJsOutputAudio": _OgvJsOutputAudio, "_OgvJsOutputFrame": _OgvJsOutputFrame, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "cttz_i8": cttz_i8, "ctlz_i8": ctlz_i8, "NaN": NaN, "Infinity": Infinity }, buffer);
var _strlen = Module["_strlen"] = asm["_strlen"];
var _bitshift64Ashr = Module["_bitshift64Ashr"] = asm["_bitshift64Ashr"];
var _OgvJsDecodeFrame = Module["_OgvJsDecodeFrame"] = asm["_OgvJsDecodeFrame"];
var _memset = Module["_memset"] = asm["_memset"];
var _bitshift64Lshr = Module["_bitshift64Lshr"] = asm["_bitshift64Lshr"];
var _OgvJsReceiveInput = Module["_OgvJsReceiveInput"] = asm["_OgvJsReceiveInput"];
var _i64Add = Module["_i64Add"] = asm["_i64Add"];
var _memmove = Module["_memmove"] = asm["_memmove"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var _i64Subtract = Module["_i64Subtract"] = asm["_i64Subtract"];
var _OgvJsDestroy = Module["_OgvJsDestroy"] = asm["_OgvJsDestroy"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _free = Module["_free"] = asm["_free"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _calloc = Module["_calloc"] = asm["_calloc"];
var _OgvJsInit = Module["_OgvJsInit"] = asm["_OgvJsInit"];
var _OgvJsDecodeAudio = Module["_OgvJsDecodeAudio"] = asm["_OgvJsDecodeAudio"];
var _OgvJsProcess = Module["_OgvJsProcess"] = asm["_OgvJsProcess"];
var _bitshift64Shl = Module["_bitshift64Shl"] = asm["_bitshift64Shl"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_iiiii = Module["dynCall_iiiii"] = asm["dynCall_iiiii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_viii = Module["dynCall_viii"] = asm["dynCall_viii"];
var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = asm["dynCall_iiiiiiiii"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
var dynCall_iiiiii = Module["dynCall_iiiiii"] = asm["dynCall_iiiiii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };
// TODO: strip out parts of this we do not need
//======= begin closure i64 code =======
// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * @fileoverview Defines a Long class for representing a 64-bit two's-complement
 * integer value, which faithfully simulates the behavior of a Java "long". This
 * implementation is derived from LongLib in GWT.
 *
 */
var i64Math = (function() { // Emscripten wrapper
  var goog = { math: {} };
  /**
   * Constructs a 64-bit two's-complement integer, given its low and high 32-bit
   * values as *signed* integers.  See the from* functions below for more
   * convenient ways of constructing Longs.
   *
   * The internal representation of a long is the two given signed, 32-bit values.
   * We use 32-bit pieces because these are the size of integers on which
   * Javascript performs bit-operations.  For operations like addition and
   * multiplication, we split each number into 16-bit pieces, which can easily be
   * multiplied within Javascript's floating-point representation without overflow
   * or change in sign.
   *
   * In the algorithms below, we frequently reduce the negative case to the
   * positive case by negating the input(s) and then post-processing the result.
   * Note that we must ALWAYS check specially whether those values are MIN_VALUE
   * (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
   * a positive number, it overflows back into a negative).  Not handling this
   * case would often result in infinite recursion.
   *
   * @param {number} low  The low (signed) 32 bits of the long.
   * @param {number} high  The high (signed) 32 bits of the long.
   * @constructor
   */
  goog.math.Long = function(low, high) {
    /**
     * @type {number}
     * @private
     */
    this.low_ = low | 0; // force into 32 signed bits.
    /**
     * @type {number}
     * @private
     */
    this.high_ = high | 0; // force into 32 signed bits.
  };
  // NOTE: Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the
  // from* methods on which they depend.
  /**
   * A cache of the Long representations of small integer values.
   * @type {!Object}
   * @private
   */
  goog.math.Long.IntCache_ = {};
  /**
   * Returns a Long representing the given (32-bit) integer value.
   * @param {number} value The 32-bit integer in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromInt = function(value) {
    if (-128 <= value && value < 128) {
      var cachedObj = goog.math.Long.IntCache_[value];
      if (cachedObj) {
        return cachedObj;
      }
    }
    var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
    if (-128 <= value && value < 128) {
      goog.math.Long.IntCache_[value] = obj;
    }
    return obj;
  };
  /**
   * Returns a Long representing the given value, provided that it is a finite
   * number.  Otherwise, zero is returned.
   * @param {number} value The number in question.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromNumber = function(value) {
    if (isNaN(value) || !isFinite(value)) {
      return goog.math.Long.ZERO;
    } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MIN_VALUE;
    } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
      return goog.math.Long.MAX_VALUE;
    } else if (value < 0) {
      return goog.math.Long.fromNumber(-value).negate();
    } else {
      return new goog.math.Long(
          (value % goog.math.Long.TWO_PWR_32_DBL_) | 0,
          (value / goog.math.Long.TWO_PWR_32_DBL_) | 0);
    }
  };
  /**
   * Returns a Long representing the 64-bit integer that comes by concatenating
   * the given high and low bits.  Each is assumed to use 32 bits.
   * @param {number} lowBits The low 32-bits.
   * @param {number} highBits The high 32-bits.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromBits = function(lowBits, highBits) {
    return new goog.math.Long(lowBits, highBits);
  };
  /**
   * Returns a Long representation of the given string, written using the given
   * radix.
   * @param {string} str The textual representation of the Long.
   * @param {number=} opt_radix The radix in which the text is written.
   * @return {!goog.math.Long} The corresponding Long value.
   */
  goog.math.Long.fromString = function(str, opt_radix) {
    if (str.length == 0) {
      throw Error('number format error: empty string');
    }
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }
    if (str.charAt(0) == '-') {
      return goog.math.Long.fromString(str.substring(1), radix).negate();
    } else if (str.indexOf('-') >= 0) {
      throw Error('number format error: interior "-" character: ' + str);
    }
    // Do several (8) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));
    var result = goog.math.Long.ZERO;
    for (var i = 0; i < str.length; i += 8) {
      var size = Math.min(8, str.length - i);
      var value = parseInt(str.substring(i, i + size), radix);
      if (size < 8) {
        var power = goog.math.Long.fromNumber(Math.pow(radix, size));
        result = result.multiply(power).add(goog.math.Long.fromNumber(value));
      } else {
        result = result.multiply(radixToPower);
        result = result.add(goog.math.Long.fromNumber(value));
      }
    }
    return result;
  };
  // NOTE: the compiler should inline these constant values below and then remove
  // these variables, so there should be no runtime penalty for these.
  /**
   * Number used repeated below in calculations.  This must appear before the
   * first call to any from* function below.
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_32_DBL_ =
      goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_31_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ / 2;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_48_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_64_DBL_ =
      goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;
  /**
   * @type {number}
   * @private
   */
  goog.math.Long.TWO_PWR_63_DBL_ =
      goog.math.Long.TWO_PWR_64_DBL_ / 2;
  /** @type {!goog.math.Long} */
  goog.math.Long.ZERO = goog.math.Long.fromInt(0);
  /** @type {!goog.math.Long} */
  goog.math.Long.ONE = goog.math.Long.fromInt(1);
  /** @type {!goog.math.Long} */
  goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);
  /** @type {!goog.math.Long} */
  goog.math.Long.MAX_VALUE =
      goog.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);
  /** @type {!goog.math.Long} */
  goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 0x80000000 | 0);
  /**
   * @type {!goog.math.Long}
   * @private
   */
  goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);
  /** @return {number} The value, assuming it is a 32-bit integer. */
  goog.math.Long.prototype.toInt = function() {
    return this.low_;
  };
  /** @return {number} The closest floating-point representation to this value. */
  goog.math.Long.prototype.toNumber = function() {
    return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ +
           this.getLowBitsUnsigned();
  };
  /**
   * @param {number=} opt_radix The radix in which the text should be written.
   * @return {string} The textual representation of this value.
   */
  goog.math.Long.prototype.toString = function(opt_radix) {
    var radix = opt_radix || 10;
    if (radix < 2 || 36 < radix) {
      throw Error('radix out of range: ' + radix);
    }
    if (this.isZero()) {
      return '0';
    }
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        // We need to change the Long value before it can be negated, so we remove
        // the bottom-most digit in this base and then recurse to do the rest.
        var radixLong = goog.math.Long.fromNumber(radix);
        var div = this.div(radixLong);
        var rem = div.multiply(radixLong).subtract(this);
        return div.toString(radix) + rem.toInt().toString(radix);
      } else {
        return '-' + this.negate().toString(radix);
      }
    }
    // Do several (6) digits each time through the loop, so as to
    // minimize the calls to the very expensive emulated div.
    var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));
    var rem = this;
    var result = '';
    while (true) {
      var remDiv = rem.div(radixToPower);
      var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
      var digits = intval.toString(radix);
      rem = remDiv;
      if (rem.isZero()) {
        return digits + result;
      } else {
        while (digits.length < 6) {
          digits = '0' + digits;
        }
        result = '' + digits + result;
      }
    }
  };
  /** @return {number} The high 32-bits as a signed value. */
  goog.math.Long.prototype.getHighBits = function() {
    return this.high_;
  };
  /** @return {number} The low 32-bits as a signed value. */
  goog.math.Long.prototype.getLowBits = function() {
    return this.low_;
  };
  /** @return {number} The low 32-bits as an unsigned value. */
  goog.math.Long.prototype.getLowBitsUnsigned = function() {
    return (this.low_ >= 0) ?
        this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
  };
  /**
   * @return {number} Returns the number of bits needed to represent the absolute
   *     value of this Long.
   */
  goog.math.Long.prototype.getNumBitsAbs = function() {
    if (this.isNegative()) {
      if (this.equals(goog.math.Long.MIN_VALUE)) {
        return 64;
      } else {
        return this.negate().getNumBitsAbs();
      }
    } else {
      var val = this.high_ != 0 ? this.high_ : this.low_;
      for (var bit = 31; bit > 0; bit--) {
        if ((val & (1 << bit)) != 0) {
          break;
        }
      }
      return this.high_ != 0 ? bit + 33 : bit + 1;
    }
  };
  /** @return {boolean} Whether this value is zero. */
  goog.math.Long.prototype.isZero = function() {
    return this.high_ == 0 && this.low_ == 0;
  };
  /** @return {boolean} Whether this value is negative. */
  goog.math.Long.prototype.isNegative = function() {
    return this.high_ < 0;
  };
  /** @return {boolean} Whether this value is odd. */
  goog.math.Long.prototype.isOdd = function() {
    return (this.low_ & 1) == 1;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long equals the other.
   */
  goog.math.Long.prototype.equals = function(other) {
    return (this.high_ == other.high_) && (this.low_ == other.low_);
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long does not equal the other.
   */
  goog.math.Long.prototype.notEquals = function(other) {
    return (this.high_ != other.high_) || (this.low_ != other.low_);
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than the other.
   */
  goog.math.Long.prototype.lessThan = function(other) {
    return this.compare(other) < 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is less than or equal to the other.
   */
  goog.math.Long.prototype.lessThanOrEqual = function(other) {
    return this.compare(other) <= 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than the other.
   */
  goog.math.Long.prototype.greaterThan = function(other) {
    return this.compare(other) > 0;
  };
  /**
   * @param {goog.math.Long} other Long to compare against.
   * @return {boolean} Whether this Long is greater than or equal to the other.
   */
  goog.math.Long.prototype.greaterThanOrEqual = function(other) {
    return this.compare(other) >= 0;
  };
  /**
   * Compares this Long with the given one.
   * @param {goog.math.Long} other Long to compare against.
   * @return {number} 0 if they are the same, 1 if the this is greater, and -1
   *     if the given one is greater.
   */
  goog.math.Long.prototype.compare = function(other) {
    if (this.equals(other)) {
      return 0;
    }
    var thisNeg = this.isNegative();
    var otherNeg = other.isNegative();
    if (thisNeg && !otherNeg) {
      return -1;
    }
    if (!thisNeg && otherNeg) {
      return 1;
    }
    // at this point, the signs are the same, so subtraction will not overflow
    if (this.subtract(other).isNegative()) {
      return -1;
    } else {
      return 1;
    }
  };
  /** @return {!goog.math.Long} The negation of this value. */
  goog.math.Long.prototype.negate = function() {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.MIN_VALUE;
    } else {
      return this.not().add(goog.math.Long.ONE);
    }
  };
  /**
   * Returns the sum of this and the given Long.
   * @param {goog.math.Long} other Long to add to this one.
   * @return {!goog.math.Long} The sum of this and the given Long.
   */
  goog.math.Long.prototype.add = function(other) {
    // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;
    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 + b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 + b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 + b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 + b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };
  /**
   * Returns the difference of this and the given Long.
   * @param {goog.math.Long} other Long to subtract from this.
   * @return {!goog.math.Long} The difference of this and the given Long.
   */
  goog.math.Long.prototype.subtract = function(other) {
    return this.add(other.negate());
  };
  /**
   * Returns the product of this and the given long.
   * @param {goog.math.Long} other Long to multiply with this.
   * @return {!goog.math.Long} The product of this and the other.
   */
  goog.math.Long.prototype.multiply = function(other) {
    if (this.isZero()) {
      return goog.math.Long.ZERO;
    } else if (other.isZero()) {
      return goog.math.Long.ZERO;
    }
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
    }
    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().multiply(other.negate());
      } else {
        return this.negate().multiply(other).negate();
      }
    } else if (other.isNegative()) {
      return this.multiply(other.negate()).negate();
    }
    // If both longs are small, use float multiplication
    if (this.lessThan(goog.math.Long.TWO_PWR_24_) &&
        other.lessThan(goog.math.Long.TWO_PWR_24_)) {
      return goog.math.Long.fromNumber(this.toNumber() * other.toNumber());
    }
    // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
    // We can skip products that would overflow.
    var a48 = this.high_ >>> 16;
    var a32 = this.high_ & 0xFFFF;
    var a16 = this.low_ >>> 16;
    var a00 = this.low_ & 0xFFFF;
    var b48 = other.high_ >>> 16;
    var b32 = other.high_ & 0xFFFF;
    var b16 = other.low_ >>> 16;
    var b00 = other.low_ & 0xFFFF;
    var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    c00 += a00 * b00;
    c16 += c00 >>> 16;
    c00 &= 0xFFFF;
    c16 += a16 * b00;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c16 += a00 * b16;
    c32 += c16 >>> 16;
    c16 &= 0xFFFF;
    c32 += a32 * b00;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a16 * b16;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c32 += a00 * b32;
    c48 += c32 >>> 16;
    c32 &= 0xFFFF;
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
    c48 &= 0xFFFF;
    return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
  };
  /**
   * Returns this Long divided by the given one.
   * @param {goog.math.Long} other Long by which to divide.
   * @return {!goog.math.Long} This Long divided by the given one.
   */
  goog.math.Long.prototype.div = function(other) {
    if (other.isZero()) {
      throw Error('division by zero');
    } else if (this.isZero()) {
      return goog.math.Long.ZERO;
    }
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      if (other.equals(goog.math.Long.ONE) ||
          other.equals(goog.math.Long.NEG_ONE)) {
        return goog.math.Long.MIN_VALUE; // recall that -MIN_VALUE == MIN_VALUE
      } else if (other.equals(goog.math.Long.MIN_VALUE)) {
        return goog.math.Long.ONE;
      } else {
        // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
        var halfThis = this.shiftRight(1);
        var approx = halfThis.div(other).shiftLeft(1);
        if (approx.equals(goog.math.Long.ZERO)) {
          return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
        } else {
          var rem = this.subtract(other.multiply(approx));
          var result = approx.add(rem.div(other));
          return result;
        }
      }
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.ZERO;
    }
    if (this.isNegative()) {
      if (other.isNegative()) {
        return this.negate().div(other.negate());
      } else {
        return this.negate().div(other).negate();
      }
    } else if (other.isNegative()) {
      return this.div(other.negate()).negate();
    }
    // Repeat the following until the remainder is less than other:  find a
    // floating-point that approximates remainder / other *from below*, add this
    // into the result, and subtract it from the remainder.  It is critical that
    // the approximate value is less than or equal to the real value so that the
    // remainder never becomes negative.
    var res = goog.math.Long.ZERO;
    var rem = this;
    while (rem.greaterThanOrEqual(other)) {
      // Approximate the result of division. This may be a little greater or
      // smaller than the actual value.
      var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));
      // We will tweak the approximate result by changing it in the 48-th digit or
      // the smallest non-fractional digit, whichever is larger.
      var log2 = Math.ceil(Math.log(approx) / Math.LN2);
      var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);
      // Decrease the approximation until it is smaller than the remainder.  Note
      // that if it is too large, the product overflows and is negative.
      var approxRes = goog.math.Long.fromNumber(approx);
      var approxRem = approxRes.multiply(other);
      while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
        approx -= delta;
        approxRes = goog.math.Long.fromNumber(approx);
        approxRem = approxRes.multiply(other);
      }
      // We know the answer can't be zero... and actually, zero would cause
      // infinite recursion since we would make no progress.
      if (approxRes.isZero()) {
        approxRes = goog.math.Long.ONE;
      }
      res = res.add(approxRes);
      rem = rem.subtract(approxRem);
    }
    return res;
  };
  /**
   * Returns this Long modulo the given one.
   * @param {goog.math.Long} other Long by which to mod.
   * @return {!goog.math.Long} This Long modulo the given one.
   */
  goog.math.Long.prototype.modulo = function(other) {
    return this.subtract(this.div(other).multiply(other));
  };
  /** @return {!goog.math.Long} The bitwise-NOT of this value. */
  goog.math.Long.prototype.not = function() {
    return goog.math.Long.fromBits(~this.low_, ~this.high_);
  };
  /**
   * Returns the bitwise-AND of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to AND.
   * @return {!goog.math.Long} The bitwise-AND of this and the other.
   */
  goog.math.Long.prototype.and = function(other) {
    return goog.math.Long.fromBits(this.low_ & other.low_,
                                   this.high_ & other.high_);
  };
  /**
   * Returns the bitwise-OR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to OR.
   * @return {!goog.math.Long} The bitwise-OR of this and the other.
   */
  goog.math.Long.prototype.or = function(other) {
    return goog.math.Long.fromBits(this.low_ | other.low_,
                                   this.high_ | other.high_);
  };
  /**
   * Returns the bitwise-XOR of this Long and the given one.
   * @param {goog.math.Long} other The Long with which to XOR.
   * @return {!goog.math.Long} The bitwise-XOR of this and the other.
   */
  goog.math.Long.prototype.xor = function(other) {
    return goog.math.Long.fromBits(this.low_ ^ other.low_,
                                   this.high_ ^ other.high_);
  };
  /**
   * Returns this Long with bits shifted to the left by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the left by the given amount.
   */
  goog.math.Long.prototype.shiftLeft = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var low = this.low_;
      if (numBits < 32) {
        var high = this.high_;
        return goog.math.Long.fromBits(
            low << numBits,
            (high << numBits) | (low >>> (32 - numBits)));
      } else {
        return goog.math.Long.fromBits(0, low << (numBits - 32));
      }
    }
  };
  /**
   * Returns this Long with bits shifted to the right by the given amount.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount.
   */
  goog.math.Long.prototype.shiftRight = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >> numBits);
      } else {
        return goog.math.Long.fromBits(
            high >> (numBits - 32),
            high >= 0 ? 0 : -1);
      }
    }
  };
  /**
   * Returns this Long with bits shifted to the right by the given amount, with
   * the new top bits matching the current sign bit.
   * @param {number} numBits The number of bits by which to shift.
   * @return {!goog.math.Long} This shifted to the right by the given amount, with
   *     zeros placed into the new leading bits.
   */
  goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
    numBits &= 63;
    if (numBits == 0) {
      return this;
    } else {
      var high = this.high_;
      if (numBits < 32) {
        var low = this.low_;
        return goog.math.Long.fromBits(
            (low >>> numBits) | (high << (32 - numBits)),
            high >>> numBits);
      } else if (numBits == 32) {
        return goog.math.Long.fromBits(high, 0);
      } else {
        return goog.math.Long.fromBits(high >>> (numBits - 32), 0);
      }
    }
  };
  //======= begin jsbn =======
  var navigator = { appName: 'Modern Browser' }; // polyfill a little
  // Copyright (c) 2005  Tom Wu
  // All Rights Reserved.
  // http://www-cs-students.stanford.edu/~tjw/jsbn/
  /*
   * Copyright (c) 2003-2005  Tom Wu
   * All Rights Reserved.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
   * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
   * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
   *
   * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
   * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
   * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
   * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
   * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * In addition, the following condition applies:
   *
   * All redistributions must retain an intact copy of this copyright notice
   * and disclaimer.
   */
  // Basic JavaScript BN library - subset useful for RSA encryption.
  // Bits per digit
  var dbits;
  // JavaScript engine analysis
  var canary = 0xdeadbeefcafe;
  var j_lm = ((canary&0xffffff)==0xefcafe);
  // (public) Constructor
  function BigInteger(a,b,c) {
    if(a != null)
      if("number" == typeof a) this.fromNumber(a,b,c);
      else if(b == null && "string" != typeof a) this.fromString(a,256);
      else this.fromString(a,b);
  }
  // return new, unset BigInteger
  function nbi() { return new BigInteger(null); }
  // am: Compute w_j += (x*this_i), propagate carries,
  // c is initial carry, returns final carry.
  // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
  // We need to select the fastest one that works in this environment.
  // am1: use a single mult and divide to get the high bits,
  // max digit bits should be 26 because
  // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
  function am1(i,x,w,j,c,n) {
    while(--n >= 0) {
      var v = x*this[i++]+w[j]+c;
      c = Math.floor(v/0x4000000);
      w[j++] = v&0x3ffffff;
    }
    return c;
  }
  // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
  function am2(i,x,w,j,c,n) {
    var xl = x&0x7fff, xh = x>>15;
    while(--n >= 0) {
      var l = this[i]&0x7fff;
      var h = this[i++]>>15;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
      c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
      w[j++] = l&0x3fffffff;
    }
    return c;
  }
  // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.
  function am3(i,x,w,j,c,n) {
    var xl = x&0x3fff, xh = x>>14;
    while(--n >= 0) {
      var l = this[i]&0x3fff;
      var h = this[i++]>>14;
      var m = xh*l+h*xl;
      l = xl*l+((m&0x3fff)<<14)+w[j]+c;
      c = (l>>28)+(m>>14)+xh*h;
      w[j++] = l&0xfffffff;
    }
    return c;
  }
  if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
  }
  else if(j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
  }
  else { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = ((1<<dbits)-1);
  BigInteger.prototype.DV = (1<<dbits);
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2,BI_FP);
  BigInteger.prototype.F1 = BI_FP-dbits;
  BigInteger.prototype.F2 = 2*dbits-BI_FP;
  // Digit conversions
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr,vv;
  rr = "0".charCodeAt(0);
  for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  function int2char(n) { return BI_RM.charAt(n); }
  function intAt(s,i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c==null)?-1:c;
  }
  // (protected) copy this to r
  function bnpCopyTo(r) {
    for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
  }
  // (protected) set from integer value x, -DV <= x < DV
  function bnpFromInt(x) {
    this.t = 1;
    this.s = (x<0)?-1:0;
    if(x > 0) this[0] = x;
    else if(x < -1) this[0] = x+DV;
    else this.t = 0;
  }
  // return bigint initialized to value
  function nbv(i) { var r = nbi(); r.fromInt(i); return r; }
  // (protected) set from string and radix
  function bnpFromString(s,b) {
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 256) k = 8; // byte array
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else { this.fromRadix(s,b); return; }
    this.t = 0;
    this.s = 0;
    var i = s.length, mi = false, sh = 0;
    while(--i >= 0) {
      var x = (k==8)?s[i]&0xff:intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-") mi = true;
        continue;
      }
      mi = false;
      if(sh == 0)
        this[this.t++] = x;
      else if(sh+k > this.DB) {
        this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
        this[this.t++] = (x>>(this.DB-sh));
      }
      else
        this[this.t-1] |= x<<sh;
      sh += k;
      if(sh >= this.DB) sh -= this.DB;
    }
    if(k == 8 && (s[0]&0x80) != 0) {
      this.s = -1;
      if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
    }
    this.clamp();
    if(mi) BigInteger.ZERO.subTo(this,this);
  }
  // (protected) clamp off excess high words
  function bnpClamp() {
    var c = this.s&this.DM;
    while(this.t > 0 && this[this.t-1] == c) --this.t;
  }
  // (public) return string representation in given radix
  function bnToString(b) {
    if(this.s < 0) return "-"+this.negate().toString(b);
    var k;
    if(b == 16) k = 4;
    else if(b == 8) k = 3;
    else if(b == 2) k = 1;
    else if(b == 32) k = 5;
    else if(b == 4) k = 2;
    else return this.toRadix(b);
    var km = (1<<k)-1, d, m = false, r = "", i = this.t;
    var p = this.DB-(i*this.DB)%k;
    if(i-- > 0) {
      if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
      while(i >= 0) {
        if(p < k) {
          d = (this[i]&((1<<p)-1))<<(k-p);
          d |= this[--i]>>(p+=this.DB-k);
        }
        else {
          d = (this[i]>>(p-=k))&km;
          if(p <= 0) { p += this.DB; --i; }
        }
        if(d > 0) m = true;
        if(m) r += int2char(d);
      }
    }
    return m?r:"0";
  }
  // (public) -this
  function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }
  // (public) |this|
  function bnAbs() { return (this.s<0)?this.negate():this; }
  // (public) return + if this > a, - if this < a, 0 if equal
  function bnCompareTo(a) {
    var r = this.s-a.s;
    if(r != 0) return r;
    var i = this.t;
    r = i-a.t;
    if(r != 0) return (this.s<0)?-r:r;
    while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
    return 0;
  }
  // returns bit length of the integer x
  function nbits(x) {
    var r = 1, t;
    if((t=x>>>16) != 0) { x = t; r += 16; }
    if((t=x>>8) != 0) { x = t; r += 8; }
    if((t=x>>4) != 0) { x = t; r += 4; }
    if((t=x>>2) != 0) { x = t; r += 2; }
    if((t=x>>1) != 0) { x = t; r += 1; }
    return r;
  }
  // (public) return the number of bits in "this"
  function bnBitLength() {
    if(this.t <= 0) return 0;
    return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
  }
  // (protected) r = this << n*DB
  function bnpDLShiftTo(n,r) {
    var i;
    for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
    for(i = n-1; i >= 0; --i) r[i] = 0;
    r.t = this.t+n;
    r.s = this.s;
  }
  // (protected) r = this >> n*DB
  function bnpDRShiftTo(n,r) {
    for(var i = n; i < this.t; ++i) r[i-n] = this[i];
    r.t = Math.max(this.t-n,0);
    r.s = this.s;
  }
  // (protected) r = this << n
  function bnpLShiftTo(n,r) {
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<cbs)-1;
    var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
    for(i = this.t-1; i >= 0; --i) {
      r[i+ds+1] = (this[i]>>cbs)|c;
      c = (this[i]&bm)<<bs;
    }
    for(i = ds-1; i >= 0; --i) r[i] = 0;
    r[ds] = c;
    r.t = this.t+ds+1;
    r.s = this.s;
    r.clamp();
  }
  // (protected) r = this >> n
  function bnpRShiftTo(n,r) {
    r.s = this.s;
    var ds = Math.floor(n/this.DB);
    if(ds >= this.t) { r.t = 0; return; }
    var bs = n%this.DB;
    var cbs = this.DB-bs;
    var bm = (1<<bs)-1;
    r[0] = this[ds]>>bs;
    for(var i = ds+1; i < this.t; ++i) {
      r[i-ds-1] |= (this[i]&bm)<<cbs;
      r[i-ds] = this[i]>>bs;
    }
    if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
    r.t = this.t-ds;
    r.clamp();
  }
  // (protected) r = this - a
  function bnpSubTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]-a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c -= a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c -= a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = (c<0)?-1:0;
    if(c < -1) r[i++] = this.DV+c;
    else if(c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  }
  // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.
  function bnpMultiplyTo(a,r) {
    var x = this.abs(), y = a.abs();
    var i = x.t;
    r.t = i+y.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
    r.s = 0;
    r.clamp();
    if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
  }
  // (protected) r = this^2, r != this (HAC 14.16)
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2*x.t;
    while(--i >= 0) r[i] = 0;
    for(i = 0; i < x.t-1; ++i) {
      var c = x.am(i,x[i],r,2*i,0,1);
      if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
        r[i+x.t] -= x.DV;
        r[i+x.t+1] = 1;
      }
    }
    if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
    r.s = 0;
    r.clamp();
  }
  // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.
  function bnpDivRemTo(m,q,r) {
    var pm = m.abs();
    if(pm.t <= 0) return;
    var pt = this.abs();
    if(pt.t < pm.t) {
      if(q != null) q.fromInt(0);
      if(r != null) this.copyTo(r);
      return;
    }
    if(r == null) r = nbi();
    var y = nbi(), ts = this.s, ms = m.s;
    var nsh = this.DB-nbits(pm[pm.t-1]); // normalize modulus
    if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
    else { pm.copyTo(y); pt.copyTo(r); }
    var ys = y.t;
    var y0 = y[ys-1];
    if(y0 == 0) return;
    var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
    var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
    var i = r.t, j = i-ys, t = (q==null)?nbi():q;
    y.dlShiftTo(j,t);
    if(r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t,r);
    }
    BigInteger.ONE.dlShiftTo(ys,t);
    t.subTo(y,y); // "negative" y so we can replace sub with am later
    while(y.t < ys) y[y.t++] = 0;
    while(--j >= 0) {
      // Estimate quotient digit
      var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
      if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) { // Try it out
        y.dlShiftTo(j,t);
        r.subTo(t,r);
        while(r[i] < --qd) r.subTo(t,r);
      }
    }
    if(q != null) {
      r.drShiftTo(ys,q);
      if(ts != ms) BigInteger.ZERO.subTo(q,q);
    }
    r.t = ys;
    r.clamp();
    if(nsh > 0) r.rShiftTo(nsh,r); // Denormalize remainder
    if(ts < 0) BigInteger.ZERO.subTo(r,r);
  }
  // (public) this mod a
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a,null,r);
    if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
    return r;
  }
  // Modular reduction using "classic" algorithm
  function Classic(m) { this.m = m; }
  function cConvert(x) {
    if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
    else return x;
  }
  function cRevert(x) { return x; }
  function cReduce(x) { x.divRemTo(this.m,null,x); }
  function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;
  // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
  // justification:
  //         xy == 1 (mod m)
  //         xy =  1+km
  //   xy(2-xy) = (1+km)(1-km)
  // x[y(2-xy)] = 1-k^2m^2
  // x[y(2-xy)] == 1 (mod m^2)
  // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
  // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
  // JS multiply "overflows" differently from C/C++, so care is needed here.
  function bnpInvDigit() {
    if(this.t < 1) return 0;
    var x = this[0];
    if((x&1) == 0) return 0;
    var y = x&3; // y == 1/x mod 2^2
    y = (y*(2-(x&0xf)*y))&0xf; // y == 1/x mod 2^4
    y = (y*(2-(x&0xff)*y))&0xff; // y == 1/x mod 2^8
    y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff; // y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = (y*(2-x*y%this.DV))%this.DV; // y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return (y>0)?this.DV-y:-y;
  }
  // Montgomery reduction
  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp&0x7fff;
    this.mph = this.mp>>15;
    this.um = (1<<(m.DB-15))-1;
    this.mt2 = 2*m.t;
  }
  // xR mod m
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t,r);
    r.divRemTo(this.m,null,r);
    if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
    return r;
  }
  // x/R mod m
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }
  // x = x/R mod m (HAC 14.32)
  function montReduce(x) {
    while(x.t <= this.mt2) // pad x so am has enough room later
      x[x.t++] = 0;
    for(var i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i]&0x7fff;
      var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
      // use am to combine the multiply-shift-add into one call
      j = i+this.m.t;
      x[j] += this.m.am(0,u0,x,i,0,this.m.t);
      // propagate carry
      while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
    }
    x.clamp();
    x.drShiftTo(this.m.t,x);
    if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
  }
  // r = "x^2/R mod m"; x != r
  function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
  // r = "xy/R mod m"; x,y != r
  function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;
  // (protected) true iff this is even
  function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }
  // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
  function bnpExp(e,z) {
    if(e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
    g.copyTo(r);
    while(--i >= 0) {
      z.sqrTo(r,r2);
      if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
      else { var t = r; r = r2; r2 = t; }
    }
    return z.revert(r);
  }
  // (public) this^e % m, 0 <= e < 2^32
  function bnModPowInt(e,m) {
    var z;
    if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
    return this.exp(e,z);
  }
  // protected
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;
  // public
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;
  // "constants"
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);
  // jsbn2 stuff
  // (protected) convert from radix string
  function bnpFromRadix(s,b) {
    this.fromInt(0);
    if(b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
    for(var i = 0; i < s.length; ++i) {
      var x = intAt(s,i);
      if(x < 0) {
        if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
        continue;
      }
      w = b*w+x;
      if(++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w,0);
        j = 0;
        w = 0;
      }
    }
    if(j > 0) {
      this.dMultiply(Math.pow(b,j));
      this.dAddOffset(w,0);
    }
    if(mi) BigInteger.ZERO.subTo(this,this);
  }
  // (protected) return x s.t. r^x < DV
  function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }
  // (public) 0 if this == 0, 1 if this > 0
  function bnSigNum() {
    if(this.s < 0) return -1;
    else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
    else return 1;
  }
  // (protected) this *= n, this >= 0, 1 < n < DV
  function bnpDMultiply(n) {
    this[this.t] = this.am(0,n-1,this,0,0,this.t);
    ++this.t;
    this.clamp();
  }
  // (protected) this += n << w words, this >= 0
  function bnpDAddOffset(n,w) {
    if(n == 0) return;
    while(this.t <= w) this[this.t++] = 0;
    this[w] += n;
    while(this[w] >= this.DV) {
      this[w] -= this.DV;
      if(++w >= this.t) this[this.t++] = 0;
      ++this[w];
    }
  }
  // (protected) convert to radix string
  function bnpToRadix(b) {
    if(b == null) b = 10;
    if(this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b,cs);
    var d = nbv(a), y = nbi(), z = nbi(), r = "";
    this.divRemTo(d,y,z);
    while(y.signum() > 0) {
      r = (a+z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d,y,z);
    }
    return z.intValue().toString(b) + r;
  }
  // (public) return value as integer
  function bnIntValue() {
    if(this.s < 0) {
      if(this.t == 1) return this[0]-this.DV;
      else if(this.t == 0) return -1;
    }
    else if(this.t == 1) return this[0];
    else if(this.t == 0) return 0;
    // assumes 16 < DB < 32
    return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
  }
  // (protected) r = this + a
  function bnpAddTo(a,r) {
    var i = 0, c = 0, m = Math.min(a.t,this.t);
    while(i < m) {
      c += this[i]+a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    if(a.t < this.t) {
      c += a.s;
      while(i < this.t) {
        c += this[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else {
      c += this.s;
      while(i < a.t) {
        c += a[i];
        r[i++] = c&this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = (c<0)?-1:0;
    if(c > 0) r[i++] = c;
    else if(c < -1) r[i++] = this.DV+c;
    r.t = i;
    r.clamp();
  }
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.addTo = bnpAddTo;
  //======= end jsbn =======
  // Emscripten wrapper
  var Wrapper = {
    abs: function(l, h) {
      var x = new goog.math.Long(l, h);
      var ret;
      if (x.isNegative()) {
        ret = x.negate();
      } else {
        ret = x;
      }
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
    },
    ensureTemps: function() {
      if (Wrapper.ensuredTemps) return;
      Wrapper.ensuredTemps = true;
      Wrapper.two32 = new BigInteger();
      Wrapper.two32.fromString('4294967296', 10);
      Wrapper.two64 = new BigInteger();
      Wrapper.two64.fromString('18446744073709551616', 10);
      Wrapper.temp1 = new BigInteger();
      Wrapper.temp2 = new BigInteger();
    },
    lh2bignum: function(l, h) {
      var a = new BigInteger();
      a.fromString(h.toString(), 10);
      var b = new BigInteger();
      a.multiplyTo(Wrapper.two32, b);
      var c = new BigInteger();
      c.fromString(l.toString(), 10);
      var d = new BigInteger();
      c.addTo(b, d);
      return d;
    },
    stringify: function(l, h, unsigned) {
      var ret = new goog.math.Long(l, h).toString();
      if (unsigned && ret[0] == '-') {
        // unsign slowly using jsbn bignums
        Wrapper.ensureTemps();
        var bignum = new BigInteger();
        bignum.fromString(ret, 10);
        ret = new BigInteger();
        Wrapper.two64.addTo(bignum, ret);
        ret = ret.toString(10);
      }
      return ret;
    },
    fromString: function(str, base, min, max, unsigned) {
      Wrapper.ensureTemps();
      var bignum = new BigInteger();
      bignum.fromString(str, base);
      var bigmin = new BigInteger();
      bigmin.fromString(min, 10);
      var bigmax = new BigInteger();
      bigmax.fromString(max, 10);
      if (unsigned && bignum.compareTo(BigInteger.ZERO) < 0) {
        var temp = new BigInteger();
        bignum.addTo(Wrapper.two64, temp);
        bignum = temp;
      }
      var error = false;
      if (bignum.compareTo(bigmin) < 0) {
        bignum = bigmin;
        error = true;
      } else if (bignum.compareTo(bigmax) > 0) {
        bignum = bigmax;
        error = true;
      }
      var ret = goog.math.Long.fromString(bignum.toString()); // min-max checks should have clamped this to a range goog.math.Long can handle well
      HEAP32[tempDoublePtr>>2] = ret.low_;
      HEAP32[tempDoublePtr+4>>2] = ret.high_;
      if (error) throw 'range error';
    }
  };
  return Wrapper;
})();
//======= end closure i64 code =======
// === Auto-generated postamble setup entry stuff ===
if (memoryInitializer) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
  }
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    applyData(Module['readBinary'](memoryInitializer));
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      applyData(data);
      removeRunDependency('memory initializer');
    }, function(data) {
      throw 'could not load memory initializer ' + memoryInitializer;
    });
  }
}
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
var preloadStartTime = null;
var calledMain = false;
dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun'] && shouldRunNow) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}
Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
    Module.printErr('preload time: ' + (Date.now() - preloadStartTime) + ' ms');
  }
  ensureInitRuntime();
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);
  initialStackTop = STACKTOP;
  try {
    var ret = Module['_main'](argc, argv, 0);
    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}
function run(args) {
  args = args || Module['arguments'];
  if (preloadStartTime === null) preloadStartTime = Date.now();
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }
  preRun();
  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame
  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;
    ensureInitRuntime();
    preMain();
    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }
    postRun();
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;
function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;
  // exit the runtime
  exitRuntime();
  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371
  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;
function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }
  ABORT = true;
  EXITSTATUS = 1;
  throw 'abort() at ' + stackTrace();
}
Module['abort'] = Module.abort = abort;
// {{PRE_RUN_ADDITIONS}}
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
run();
// {{POST_RUN_ADDITIONS}}
// {{MODULE_ADDITIONS}}
    var OgvJsInit = Module.cwrap('OgvJsInit', 'void', ['number', 'number']);
    var OgvJsDestroy = Module.cwrap('OgvJsDestroy', 'void', []);
    var OgvJsReceiveInput = Module.cwrap('OgvJsReceiveInput', 'void', ['*', 'number']);
    var OgvJsProcess = Module.cwrap('OgvJsProcess', 'int', []);
    var OgvJsDecodeFrame = Module.cwrap('OgvJsDecodeFrame', 'int', []);
    var OgvJsDecodeAudio = Module.cwrap('OgvJsDecodeAudio', 'int', []);
 var inputBuffer, inputBufferSize;
 function reallocInputBuffer(size) {
  if (inputBuffer && inputBufferSize >= size) {
   // We're cool
   return inputBuffer;
  }
  if (inputBuffer) {
   Module._free(inputBuffer);
  }
  inputBufferSize = size;
  console.log('reallocating buffer');
  inputBuffer = Module._malloc(inputBufferSize);
  return inputBuffer;
 }
 function OgvJsInitVideoCallback(info) {
  self.hasVideo = true;
  if (self.oninitvideo) {
   self.oninitvideo(info);
  }
 }
 function OgvJsOutputFrameReadyCallback() {
  self.frameReady = true;
 }
 var queuedFrame = null;
 function OgvJsFrameCallback(frameBuffer) {
  queuedFrame = frameBuffer;
 }
 function OgvJsInitAudioCallback(info) {
  self.hasAudio = true;
  if (self.oninitaudio) {
   self.oninitaudio(info);
  }
 }
 function OgvJsOutputAudioReadyCallback() {
  self.audioReady = true;
 }
 var audioBuffers = [];
 function OgvJsAudioCallback(audioData) {
  audioBuffers.push(audioData);
 }
 /**
	 * @property function({codec, frameWidth, frameHeight, fps, picWidth, picHeight, picX, picY}) event handler when initializing video stream
	 */
 self.onvideoinit = null;
 /**
	 * @property function({codec, channels, rate}) event handler when initializing audio stream
	 */
 self.onaudioinit = null;
 /**
	 * @property boolean does the media stream contain video?
	 */
 self.hasVideo = false;
 /**
	 * @property boolean does the media stream contain audio?
	 */
 self.hasAudio = false;
 /**
	 * @property boolean Have we found a frame that's ready to be decoded?
	 */
 self.frameReady = false;
 /**
	 * @property boolean Have we found an audio buffer that's ready to be decoded?
	 */
 self.audioReady = false;
 /**
	 * @property number time position in seconds of last decoded frame
	 */
 self.videoPosition = 0.0;
 /**
	 * Tear down the instance when done.
	 *
	 * todo: do we need to do something more to destroy the C environment?
	 */
 self.destroy = function() {
  if (inputBuffer) {
   Module._free(inputBuffer);
   inputBuffer = undefined;
  }
  OgvJsDestroy();
  console.log("ogv.js destroyed");
 };
 /**
	 * Queue up a chunk of input data for later processing.
	 *
	 * @param ArrayBuffer data
	 */
 self.receiveInput = function(data) {
  // Map the blob into a buffer in emscripten's runtime heap
  var len = data.byteLength;
  var buffer = reallocInputBuffer(len);
  Module.HEAPU8.set(new Uint8Array(data), buffer);
  OgvJsReceiveInput(buffer, len);
 };
 /**
	 * Process the next packet in the stream
	 */
 self.process = function() {
  return OgvJsProcess();
 }
 /**
	 * Decode the last-found video packet
	 *
	 * @return boolean true if successful decode, false if failure
	 */
 self.decodeFrame = function() {
  if (self.frameReady) {
   self.frameReady = false;
   return !!OgvJsDecodeFrame();
  } else {
   throw new Error("called decodeFrame when no frame ready");
  }
 }
 /**
	 * Return the last-decoded frame, if any.
	 *
	 * @return ImageData
	 */
 self.dequeueFrame = function() {
  if (queuedFrame) {
   var frame = queuedFrame;
   queuedFrame = null;
   return frame;
  } else {
   throw new Error("called dequeueFrame when no frame ready");
  }
 }
 /**
	 * Decode the last-found audio packets
	 *
	 * @return boolean true if successful decode, false if failure
	 */
 self.decodeAudio = function() {
  if (self.audioReady) {
   self.audioReady = false;
   return !!OgvJsDecodeAudio();
  } else {
   throw new Error("called decodeAudio when no audio ready");
  }
 }
 self.audioQueued = function() {
  return audioBuffers.length > 0;
 };
 /**
	 * Return the next decoded audio buffer
	 *
	 * @return array of audio thingies
	 */
 self.dequeueAudio = function() {
  if (self.audioQueued()) {
   var buffer = audioBuffers.shift();
   self.audioReady = (audioBuffers.length > 0);
   return buffer;
  } else {
   throw new Error("called dequeueAudio when no audio ready");
  }
 }
 /**
	 * Is there processed data to handle?
	 *
	 * @return boolean
	 */
 self.dataReady = function() {
  return self.audioReady || self.frameReady;
 }
 OgvJsInit(processAudio ? 1 : 0, processVideo ? 1 : 0);
 return self;
});
