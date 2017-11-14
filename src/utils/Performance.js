/*
 *  创建人： M.E.-Y;
 *  创建时间： 2017-10-12;
 *
*/
/* eslint-disable */
// Using the Resource Timing API
// Timing resource loading phases
export function calculate_load_times () {
  // Check performance support
  var list = []
  if (performance === undefined) {
    console.log("= Calculate Load Times: performance NOT supported")
    return list
  }

  // Get a list of "resource" performance entries
  var resources = performance.getEntriesByType("resource")
  if (resources === undefined || resources.length <= 0) {
    console.log("= Calculate Load Times: there are NO `resource` performance records")
    return lsit
  }

  console.log("= Calculate Load Times")
  for (var i = 0; i < resources.length; i++) {
    var calculateLoadTimes = {}
    calculateLoadTimes.Resource = resources[i].name
    // Redirect time
    calculateLoadTimes['RedirectTime'] = resources[i].redirectEnd - resources[i].redirectStart

    // DNS time
    calculateLoadTimes['DNSTime'] = resources[i].domainLookupEnd - resources[i].domainLookupStart

    // TCP handshake time
    calculateLoadTimes['TCPTime'] = resources[i].connectEnd - resources[i].connectStart

    // Secure connection time
    if (resources[i].secureConnectionStart > 0) {
      calculateLoadTimes['SecureConnectionTime'] = resources[i].connectEnd - resources[i].secureConnectionStart
    } else {
      calculateLoadTimes['SecureConnectionTime'] = 0
    }

    // Response time
    calculateLoadTimes['ResponseTime'] = resources[i].responseEnd - resources[i].responseStart

    // Fetch until response end
    if (resources[i].fetchStart > 0) {
      calculateLoadTimes['FetchUntilResponseEndTime'] = resources[i].responseEnd - resources[i].fetchStart
    } else {
      calculateLoadTimes['FetchUntilResponseEndTime'] = 0
    }

    // Request start until reponse end
    if (resources[i].requestStart > 0) {
      calculateLoadTimes['RequestStartUntilReponseEnd'] = resources[i].responseEnd - resources[i].requestStart
    } else {
      calculateLoadTimes['RequestStartUntilReponseEnd'] = 0
    }

    // Start until reponse end
    if (resources[i].startTime > 0) {
      calculateLoadTimes['StartUntilResponseEndTime'] = resources[i].responseEnd - resources[i].startTime
    } else {
      calculateLoadTimes['StartUntilResponseEndTime'] = 0
    }
    list.push(calculateLoadTimes)
  }
  return list
}

// Size matters
export function display_size_data () {
  // Check for support of the PerformanceResourceTiming.*size properties and print their values
  // if supported.
  var data = []
  if (performance === undefined) {
    console.log("= Display Size Data: performance NOT supported")
    return data
  }

  var list = performance.getEntriesByType("resource")
  if (list === undefined) {
    console.log("= Display Size Data: performance.getEntriesByType() is  NOT supported")
    return data
  }

  // For each "resource", display its *Size property values
  console.log("= Display Size Data")
  for (var i = 0; i < list.length; i++) {
    var obj = {}
    obj.Resource = list[i].name
    // console.log("== Resource[" + i + "] - " + list[i].name);
    if ("decodedBodySize" in list[i])
      obj.decodedBodySize = list[i].decodedBodySize
      // console.log("... decodedBodySize[" + i + " = " + list[i].decodedBodySize);
    else
      obj.decodedBodySize = 'NOT supported'
      // console.log("... decodedBodySize[" + i + " = NOT supported");
    if ("encodedBodySize" in list[i])
      obj.encodedBodySize = list[i].encodedBodySize
      // console.log("... encodedBodySize[" + i + " = " + list[i].encodedBodySize);
    else
      obj.encodedBodySize = 'NOT supported'
      // console.log("... encodedBodySize[" + i + " = NOT supported");
    if ("transferSize" in list[i])
      obj.transferSize = list[i].transferSize
      // console.log("... transferSize[" + i + " = " + list[i].transferSize);
    else
      obj.transferSize = 'NOT supported'
      // console.log("... transferSize[" + i + " = NOT supported");
    data.push(obj)
  }
  return data
}

// Paint Timing API (页面绘制)
export function paint_timing () {
  let data = []
  if ('performance' in window) {
    window.addEventListener('load', () => {
      let paintMetrics = performance.getEntriesByType('paint')
      if (paintMetrics !== undefined && paintMetrics.length > 0) {
        data = paintMetrics
      }
    })
  }
  return data
}

// Managing the resource buffer
function clear_resource_timings () {
  if (performance === undefined) {
    console.log("= performance.clearResourceTimings(): peformance NOT supported");
    return;
  }
  // Check if Performance.clearResourceTiming() is supported 
  console.log ("= Print performance.clearResourceTimings()");
  var supported = typeof performance.clearResourceTimings == "function";
  if (supported) {
    console.log("... Performance.clearResourceTimings() = supported");
    performance.clearResourceTimings();
  } else {
    console.log("... Performance.clearResourceTiming() = NOT supported");
    return;
  }
  // getEntries should now return zero
  var p = performance.getEntriesByType("resource");
  if (p.length == 0)  
    console.log("... Performance data buffer cleared");
  else
    console.log("... Performance data buffer NOT cleared (still have `" + p.length + "` items");
}

function set_resource_timing_buffer_size (n) {
  if (performance === undefined) {
    console.log("= performance.setResourceTimingBufferSize(): peformance NOT supported");
    return;
  }
  // Check if Performance.setResourceTimingBufferSize() is supported 
  console.log ("= performance.setResourceTimingBufferSize()");
  var supported = typeof performance.setResourceTimingBufferSize == "function";
  if (supported) {
    console.log("... Performance.setResourceTimingBufferSize() = supported");
    performance.setResourceTimingBufferSize(n);
  } else {
    console.log("... Performance.setResourceTimingBufferSize() = NOT supported");
  }
}

function buffer_full (event) {
  console.log("WARNING: Resource Timing Buffer is FULL!");
  set_resource_timing_buffer_size(200);
}

function init () {
  // load some image to trigger "resource" fetch events
  var image1 = new Image();
  image1.src = "https://developer.mozilla.org/static/img/opengraph-logo.png";
  var image2 = new Image();
  image2.src = "http://mozorg.cdn.mozilla.net/media/img/firefox/firefox-256.e2c1fc556816.jpg"
 
  // Set a callback if the resource buffer becomes filled
  performance.onresourcetimingbufferfull = buffer_full;
}

// Using the User Timing API
// Creating a performance mark
function create_marks (ev) {
  if (performance.mark === undefined) {
    console.log("Create Marks: performance.mark Not supported", 0);
    return;
  } else {
    console.log("Create marks", 0);
    // Create several performance marks including two with the same name
    performance.mark("mark-1");
    // do_work(50000);
    performance.mark("mark-2");
    // do_work(50000);
    performance.mark("mark-2");
    var marks = ["mark-1", "mark-2", "mark-2"];
    for (var i=0; i < marks.length; i++) {
      console.log("... Created mark = " + marks[i], 0);
    }
  }
}

// Retrieving performance marks
function display_marks (ev) {
  if (performance.getEntries === undefined) {
    console.log("Display Marks: performance.getEntries Not supported", 0);
    return;
  }
  console.log("Display marks", 0);

  // Display each mark using getEntries()
  var entries = performance.getEntries();
  var j=0;
  for (var i=0; i < entries.length; i++) {
    if (entries[i].entryType == "mark") {
      if (j == 0) { console.log("= getEntries()", 0); j++ }
      console.log("... [" + i + "] = " + entries[i].name, 0);
    }
  }

  // Display each mark using getEntriesByType()
  entries = performance.getEntriesByType("mark");
  for (var i=0; i < entries.length; i++) {
    if (i == 0) console.log("= getEntriesByType('mark')", 0);
    console.log("... [" + i + "] = " + entries[i].name, 0);
  }

  // Display each mark using getEntriesName(); must look for each mark separately
  entries = performance.getEntriesByName("mark-1","mark");
  for (var i=0; i < entries.length; i++) {
    if (i == 0) console.log("= getEntriesByName('mark-1', 'mark')", 0);
    console.log("... " + entries[i].name, 0);
  }
  entries = performance.getEntriesByName("mark-2","mark");
  for (var i=0; i < entries.length; i++) {
    if (i == 0) console.log("= getEntriesByName('mark-2', 'mark')", 0);
    console.log("... " + entries[i].name, 0);
  }
}

// Removing performance marks
function clear_marks (obj) {
  if (performance.clearMarks === undefined) {
    console.log("Clear Marks: performance.clearMarks Not supported", 0);
    return;
  }
  console.log("Clear marks", 0);

  if (typeof obj == "string") {
    console.log("... cleared '" + obj + "' mark(s)", 0);
    performance.clearMarks(obj);
  } else {
    // No argument specified so clear all marks
    console.log("... cleared All marks", 0);
    performance.clearMarks();
  }
}

// Creating a performance measure
function create_measures (ev) {
  if (performance.measure === undefined) {
    console.log("Create Measures: performance.measure Not supported", 1);
    return;
  }
  console.log("Create measures", 1);

  // Create several performance marks
  performance.mark("mark-A");
  // do_work(50000);
  performance.mark("mark-B");

  performance.mark("mark-C");
  // do_work(50000);
  performance.mark("mark-D");

  // Create some measures
  performance.measure("measure-1", "mark-A", "mark-B");
  performance.measure("measure-2", "mark-C", "mark-D");

  // Log the marks and measures
  var marks = ["mark-A", "mark-B", "mark-C", "mark-D"];
  for (var i=0; i < marks.length; i++)
    console.log("... Created mark = " + marks[i], 1);
  var measures = ["measures-1", "measures-2"];
  for (var i=0; i < measures.length; i++)
    console.log("... Created measure = " + measures[i], 1);
}

// Retrieving performance measures
function display_measures (ev) {
  if (performance.getEntries === undefined) {
    console.log("Display Measures: performance.getEntries Not supported", 1);
    return;
  }
  console.log("Display measures", 1);

  // Display each measure using getEntries()
  var entries = performance.getEntries();
  var j=0;
  for (var i=0; i < entries.length; i++) {
    if (entries[i].entryType == "measure") {
      if (j == 0) { console.log("= getEntries()", 1); j++ }
      console.log("... [" + i + "] = " + entries[i].name, 1);
    }
  }

  // Display each measure using getEntriesByType
  entries = performance.getEntriesByType("measure");
  for (var i=0; i < entries.length; i++) {
    if (i == 0) console.log("= getEntriesByType('measure')", 1);
    console.log("... [" + i + "] = " + entries[i].name, 1);
  }

  // Display each measure using getEntriesName() - have to look for each measure separately
  entries = performance.getEntriesByName("measure-1","measure");
  for (var i=0; i < entries.length; i++) {
    if (i == 0) console.log("= getEntriesByName('measure-1', 'measure')", 1);
    console.log("... " + entries[i].name, 1);
  }
  entries = performance.getEntriesByName("measure-2","measure");
  for (var i=0; i < entries.length; i++) {
    if (i == 0) console.log("= getEntriesByName('measure-2', 'measure')", 1);
    console.log("... " + entries[i].name, 1);
  }
}

// Removing performance measures
function clear_measures (obj) {
  if (performance.clearMeasures === undefined) {
    console.log("Clear Mearsures: performance.clearMeasures Not supported", 1);
    return;
  }
  console.log("Clear measures", 1);

  if (typeof obj == "string") {
    console.log("... cleared '" + obj + "' measure(s)", 1);
    performance.clearMeasures(obj);
  } else {
    // No argument specified so clear all measures
    console.log("... cleared All measures", 1);
    performance.clearMeasures();
  }
}
