/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8478260869565217, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Conversation: Create Conversation Messages"], "isController": false}, {"data": [1.0, 500, 1500, "Resource: List Project Resources"], "isController": false}, {"data": [1.0, 500, 1500, "Resource: Create Resource"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: Read User Conversation Messages"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: List Conversations"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: Update Conversation"], "isController": false}, {"data": [1.0, 500, 1500, "Project: Read Project"], "isController": false}, {"data": [1.0, 500, 1500, "Project: Update Project"], "isController": false}, {"data": [1.0, 500, 1500, "Resource: List Resources"], "isController": false}, {"data": [0.5, 500, 1500, "Assistant_api_data"], "isController": false}, {"data": [0.5, 500, 1500, "Project: Create Project Resource"], "isController": false}, {"data": [1.0, 500, 1500, "Project: List Projects"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: Read Conversation"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: Create Conversation"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: Delete Conversation"], "isController": false}, {"data": [1.0, 500, 1500, "Project: Delete Project"], "isController": false}, {"data": [0.0, 500, 1500, "Create User Session"], "isController": false}, {"data": [0.5, 500, 1500, "Create Access Token"], "isController": false}, {"data": [1.0, 500, 1500, "Project: Create Project"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: List Project Conversations"], "isController": false}, {"data": [1.0, 500, 1500, "Resource: Update Resource"], "isController": false}, {"data": [1.0, 500, 1500, "Resouce: Delete Resource"], "isController": false}, {"data": [1.0, 500, 1500, "Resouce: Read Resource"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23, 0, 0.0, 1174.5652173913043, 91, 13531, 134.0, 5642.4000000000115, 12597.199999999986, 13531.0, 0.8285899560487067, 12.73000126089776, 1.2160064215721593], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Conversation: Create Conversation Messages", 1, 0, 0.0, 8862.0, 8862, 8862, 8862.0, 8862.0, 8862.0, 8862.0, 0.11284134506883323, 0.45026341401489506, 0.2214952183480027], "isController": false}, {"data": ["Resource: List Project Resources", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 8.073561262376238, 15.189897896039604], "isController": false}, {"data": ["Resource: Create Resource", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 6.707863729508197, 13.767930327868854], "isController": false}, {"data": ["Conversation: Read User Conversation Messages", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 23.839929601648354, 8.391998626373626], "isController": false}, {"data": ["Conversation: List Conversations", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 371.3925489738806, 11.070137593283581], "isController": false}, {"data": ["Conversation: Update Conversation", 1, 0, 0.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 125.0, 8.0, 8.0625, 12.7734375], "isController": false}, {"data": ["Project: Read Project", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 7.692430840163935, 12.407146516393443], "isController": false}, {"data": ["Project: Update Project", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 5.277826544943821, 9.348665730337078], "isController": false}, {"data": ["Resource: List Resources", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 1963.8948914007094, 10.631371897163122], "isController": false}, {"data": ["Assistant_api_data", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.0, 0.0], "isController": false}, {"data": ["Project: Create Project Resource", 1, 0, 0.0, 742.0, 742, 742, 742.0, 742.0, 742.0, 742.0, 1.3477088948787064, 1.6319912398921832, 2.2163493935309972], "isController": false}, {"data": ["Project: List Projects", 1, 0, 0.0, 158.0, 158, 158, 158.0, 158.0, 158.0, 158.0, 6.329113924050633, 8.640723892405063, 9.462767009493671], "isController": false}, {"data": ["Conversation: Read Conversation", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 10.078125, 15.185546875], "isController": false}, {"data": ["Conversation: Create Conversation", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 7.614250469924811, 12.100563909774435], "isController": false}, {"data": ["Conversation: Delete Conversation", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 6.143810679611651, 14.951835558252428], "isController": false}, {"data": ["Project: Delete Project", 1, 0, 0.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 5.460258152173913, 13.349184782608695], "isController": false}, {"data": ["Create User Session", 1, 0, 0.0, 13531.0, 13531, 13531, 13531.0, 13531.0, 13531.0, 13531.0, 0.07390436774813391, 0.07751297945458577, 0.13019871036878278], "isController": false}, {"data": ["Create Access Token", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 3.473823800738008, 0.4264202798277983], "isController": false}, {"data": ["Project: Create Project", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 2.9665389150943398, 5.07014052672956], "isController": false}, {"data": ["Conversation: List Project Conversations", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 9.948059752747254, 16.698145604395606], "isController": false}, {"data": ["Resource: Update Resource", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 5.769337322695036, 11.767231826241137], "isController": false}, {"data": ["Resouce: Delete Resource", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 6.620065789473684, 16.16981907894737], "isController": false}, {"data": ["Resouce: Read Resource", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 8.747059811827958, 16.286542338709676], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
