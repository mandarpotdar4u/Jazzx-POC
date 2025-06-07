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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8260869565217391, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Conversation: Create Conversation Messages"], "isController": false}, {"data": [1.0, 500, 1500, "Resource: List Project Resources"], "isController": false}, {"data": [1.0, 500, 1500, "Resource: Create Resource"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: Read User Conversation Messages"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: List Conversations"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: Update Conversation"], "isController": false}, {"data": [1.0, 500, 1500, "Project: Read Project"], "isController": false}, {"data": [1.0, 500, 1500, "Project: Update Project"], "isController": false}, {"data": [1.0, 500, 1500, "Resource: List Resources"], "isController": false}, {"data": [0.5, 500, 1500, "Assistant_api_data"], "isController": false}, {"data": [0.5, 500, 1500, "Project: Create Project Resource"], "isController": false}, {"data": [1.0, 500, 1500, "Project: List Projects"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: Read Conversation"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: Create Conversation"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: Delete Conversation"], "isController": false}, {"data": [1.0, 500, 1500, "Project: Delete Project"], "isController": false}, {"data": [0.0, 500, 1500, "Create User Session"], "isController": false}, {"data": [0.0, 500, 1500, "Create Access Token"], "isController": false}, {"data": [1.0, 500, 1500, "Project: Create Project"], "isController": false}, {"data": [1.0, 500, 1500, "Conversation: List Project Conversations"], "isController": false}, {"data": [1.0, 500, 1500, "Resource: Update Resource"], "isController": false}, {"data": [1.0, 500, 1500, "Resouce: Delete Resource"], "isController": false}, {"data": [1.0, 500, 1500, "Resouce: Read Resource"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23, 0, 0.0, 714.0869565217394, 135, 7753, 175.0, 1929.6000000000004, 6607.199999999983, 7753.0, 1.3393117102428231, 20.59350979735632, 1.9655218220462356], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Conversation: Create Conversation Messages", 1, 0, 0.0, 7753.0, 7753, 7753, 7753.0, 7753.0, 7753.0, 7753.0, 0.12898232942086935, 0.5335636205339869, 0.25317820521088613], "isController": false}, {"data": ["Resource: List Project Resources", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 5.74246258802817, 10.80408230633803], "isController": false}, {"data": ["Resource: Create Resource", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 4.521322513812155, 9.280041436464089], "isController": false}, {"data": ["Conversation: Read User Conversation Messages", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 15.20458156779661, 5.177436440677966], "isController": false}, {"data": ["Conversation: List Conversations", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 222.17232840401786, 6.622314453125], "isController": false}, {"data": ["Conversation: Update Conversation", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 6.034805389221557, 9.56095621257485], "isController": false}, {"data": ["Project: Read Project", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 4.365007267441861, 7.040334302325581], "isController": false}, {"data": ["Project: Update Project", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 4.867632772020725, 8.62208549222798], "isController": false}, {"data": ["Resource: List Resources", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 876.2948724287975, 4.743745055379747], "isController": false}, {"data": ["Assistant_api_data", 1, 0, 0.0, 846.0, 846, 846, 846.0, 846.0, 846.0, 846.0, 1.1820330969267139, 0.0, 0.0], "isController": false}, {"data": ["Project: Create Project Resource", 1, 0, 0.0, 769.0, 769, 769, 769.0, 769.0, 769.0, 769.0, 1.3003901170351106, 1.5746911573472042, 2.1385321846553964], "isController": false}, {"data": ["Project: List Projects", 1, 0, 0.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 9.965214416058393, 10.913264142335766], "isController": false}, {"data": ["Conversation: Read Conversation", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 6.182898773006134, 9.316286426380367], "isController": false}, {"data": ["Conversation: Create Conversation", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 5.786830357142858, 9.196428571428571], "isController": false}, {"data": ["Conversation: Delete Conversation", 1, 0, 0.0, 145.0, 145, 145, 145.0, 145.0, 145.0, 145.0, 6.896551724137931, 4.364224137931035, 10.620959051724139], "isController": false}, {"data": ["Project: Delete Project", 1, 0, 0.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 4.360622829861112, 10.660807291666668], "isController": false}, {"data": ["Create User Session", 1, 0, 0.0, 1788.0, 1788, 1788, 1788.0, 1788.0, 1788.0, 1788.0, 0.5592841163310962, 0.5865929110738255, 0.9853013143176733], "isController": false}, {"data": ["Create Access Token", 1, 0, 0.0, 2024.0, 2024, 2024, 2024.0, 2024.0, 2024.0, 2024.0, 0.49407114624505927, 1.3953649950592886, 0.17128443058300394], "isController": false}, {"data": ["Project: Create Project", 1, 0, 0.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 150.0, 6.666666666666667, 6.2890625, 10.748697916666668], "isController": false}, {"data": ["Conversation: List Project Conversations", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 5.622816381987578, 9.438082298136646], "isController": false}, {"data": ["Resource: Update Resource", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 4.9602229420731705, 10.11694931402439], "isController": false}, {"data": ["Resouce: Delete Resource", 1, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 7.407407407407407, 4.658564814814815, 11.378761574074073], "isController": false}, {"data": ["Resouce: Read Resource", 1, 0, 0.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 5.937785127737226, 11.055828010948904], "isController": false}]}, function(index, item){
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
