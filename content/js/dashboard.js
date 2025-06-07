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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23, 0, 0.0, 1283.9130434782612, 117, 13514, 169.0, 6630.400000000012, 12857.599999999991, 13514.0, 0.7598784194528876, 11.67777489840756, 1.1151680405048237], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Conversation: Create Conversation Messages", 1, 0, 0.0, 10232.0, 10232, 10232, 10232.0, 10232.0, 10232.0, 10232.0, 0.09773260359655982, 0.3950344202013292, 0.19183841135652854], "isController": false}, {"data": ["Resource: List Project Resources", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 6.683849897540984, 12.575243340163935], "isController": false}, {"data": ["Resource: Create Resource", 1, 0, 0.0, 155.0, 155, 155, 155.0, 155.0, 155.0, 155.0, 6.451612903225806, 5.279737903225806, 10.836693548387096], "isController": false}, {"data": ["Conversation: Read User Conversation Messages", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 22.63208762886598, 7.872905927835052], "isController": false}, {"data": ["Conversation: List Conversations", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 248.8330078125, 7.4169921875], "isController": false}, {"data": ["Conversation: Update Conversation", 1, 0, 0.0, 145.0, 145, 145, 145.0, 145.0, 145.0, 145.0, 6.896551724137931, 6.950431034482759, 11.011584051724139], "isController": false}, {"data": ["Project: Read Project", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 5.5531157544378695, 8.956638313609467], "isController": false}, {"data": ["Project: Update Project", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 4.329277073732719, 7.668490783410138], "isController": false}, {"data": ["Resource: List Resources", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1018.0484547334559, 5.511115579044117], "isController": false}, {"data": ["Assistant_api_data", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.0, 0.0], "isController": false}, {"data": ["Project: Create Project Resource", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 1.4678030303030303, 1.9933712121212122], "isController": false}, {"data": ["Project: List Projects", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 7.713188559322035, 8.446989759887007], "isController": false}, {"data": ["Conversation: Read Conversation", 1, 0, 0.0, 157.0, 157, 157, 157.0, 157.0, 157.0, 157.0, 6.369426751592357, 6.419187898089172, 9.672322850318471], "isController": false}, {"data": ["Conversation: Create Conversation", 1, 0, 0.0, 153.0, 153, 153, 153.0, 153.0, 153.0, 153.0, 6.5359477124183005, 6.618923611111112, 10.518790849673202], "isController": false}, {"data": ["Conversation: Delete Conversation", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 5.408653846153846, 13.16272702991453], "isController": false}, {"data": ["Project: Delete Project", 1, 0, 0.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 4.757043087121212, 11.62997159090909], "isController": false}, {"data": ["Create User Session", 1, 0, 0.0, 13514.0, 13514, 13514, 13514.0, 13514.0, 13514.0, 13514.0, 0.07399733609590055, 0.0776104872724582, 0.1303624944501998], "isController": false}, {"data": ["Create Access Token", 1, 0, 0.0, 1228.0, 1228, 1228, 1228.0, 1228.0, 1228.0, 1228.0, 0.8143322475570033, 2.2998524022801305, 0.28231244910423453], "isController": false}, {"data": ["Project: Create Project", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 2.911603009259259, 4.976249035493827], "isController": false}, {"data": ["Conversation: List Project Conversations", 1, 0, 0.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 118.0, 8.474576271186441, 7.6718087923728815, 12.877383474576272], "isController": false}, {"data": ["Resource: Update Resource", 1, 0, 0.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 5.649142795138889, 11.522081163194445], "isController": false}, {"data": ["Resouce: Delete Resource", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 4.693330223880597, 11.46367770522388], "isController": false}, {"data": ["Resouce: Read Resource", 1, 0, 0.0, 120.0, 120, 120, 120.0, 120.0, 120.0, 120.0, 8.333333333333334, 6.778971354166667, 12.6220703125], "isController": false}]}, function(index, item){
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
