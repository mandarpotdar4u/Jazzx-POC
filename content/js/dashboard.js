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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23, 0, 0.0, 1257.4347826086955, 125, 13849, 179.0, 5824.4000000000115, 12903.199999999986, 13849.0, 0.7751415475869506, 11.888641332737935, 1.1375676142491238], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Conversation: Create Conversation Messages", 1, 0, 0.0, 9120.0, 9120, 9120, 9120.0, 9120.0, 9120.0, 9120.0, 0.10964912280701755, 0.4046523780153509, 0.21522923519736845], "isController": false}, {"data": ["Resource: List Project Resources", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 5.908910778985507, 11.11724411231884], "isController": false}, {"data": ["Resource: Create Resource", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 4.9899961890243905, 10.241996951219512], "isController": false}, {"data": ["Conversation: Read User Conversation Messages", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 328.0, 3.048780487804878, 12.31421493902439, 4.6565358231707314], "isController": false}, {"data": ["Conversation: List Conversations", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 232.5542129088785, 6.931768399532711], "isController": false}, {"data": ["Conversation: Update Conversation", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 5.859375000000001, 9.283021438953488], "isController": false}, {"data": ["Project: Read Project", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 5.242885824022347, 8.456267458100559], "isController": false}, {"data": ["Project: Update Project", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 3.379327787769784, 5.985836330935252], "isController": false}, {"data": ["Resource: List Resources", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 706.4009685905612, 3.824039381377551], "isController": false}, {"data": ["Assistant_api_data", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.0, 0.0], "isController": false}, {"data": ["Project: Create Project Resource", 1, 0, 0.0, 871.0, 871, 871, 871.0, 871.0, 871.0, 871.0, 1.1481056257175661, 1.3902841561423651, 1.888095579793341], "isController": false}, {"data": ["Project: List Projects", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 7.627007681564246, 8.35260998603352], "isController": false}, {"data": ["Conversation: Read Conversation", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 7.520988805970148, 11.332497667910447], "isController": false}, {"data": ["Conversation: Create Conversation", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 6.450288614649682, 10.250796178343949], "isController": false}, {"data": ["Conversation: Delete Conversation", 1, 0, 0.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 4.905523255813954, 11.93828730620155], "isController": false}, {"data": ["Project: Delete Project", 1, 0, 0.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 6.451612903225806, 4.051159274193548, 9.904233870967742], "isController": false}, {"data": ["Create User Session", 1, 0, 0.0, 13849.0, 13849, 13849, 13849.0, 13849.0, 13849.0, 13849.0, 0.07220737959419453, 0.0757331305509423, 0.1272090945194599], "isController": false}, {"data": ["Create Access Token", 1, 0, 0.0, 881.0, 881, 881, 881.0, 881.0, 881.0, 881.0, 1.1350737797956867, 3.2056966515323495, 0.3935070232690125], "isController": false}, {"data": ["Project: Create Project", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 2.335047957920792, 3.990853186881188], "isController": false}, {"data": ["Conversation: List Project Conversations", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 6.80656719924812, 11.425046992481203], "isController": false}, {"data": ["Resource: Update Resource", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 4.544561801675978, 9.269160265363128], "isController": false}, {"data": ["Resouce: Delete Resource", 1, 0, 0.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 4.307577054794521, 10.521457619863014], "isController": false}, {"data": ["Resouce: Read Resource", 1, 0, 0.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 125.0, 8.0, 6.5078125, 12.1171875], "isController": false}]}, function(index, item){
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
