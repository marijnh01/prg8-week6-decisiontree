import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/mushrooms.csv"
const trainingLabel = "class"
const ignored = ["class","population","habitat"]


let goodPoison = 0;
let goodEdible = 0;
let isPoison = 0;
let isEdible = 0;

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: data,
        categoryAttr: trainingLabel
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())


    // todo : maak een prediction met een sample uit de testdata
    let paddo = testData[0]
    let paddoPrediction = decisionTree.predict(paddo)
    console.log(`The paddo is : ${paddoPrediction}`)

    // todo : bereken de accuracy met behulp van alle test data
    function accuracy(data, tree, label) {
        let correct = 0;
        for (const row of data) {
            if (row.class === tree.predict(row)) {
                correct++
            }
        }
        let element = document.getElementById("accuracy")
        element.innerText = `Accuracy ${label}: ${correct / data.length}`
        console.log(`Accuracy ${label}: ${correct / data.length}`)
    }

    //train accuracy
    accuracy(trainData, decisionTree, "train")

    //test accuracy
    accuracy(testData, decisionTree, "test")
    for (const row of data) {
        if (row.class === "e" && decisionTree.predict(row) === "p") {

            isPoison++
        } else if (row.class === "p" && decisionTree.predict(row) === "e") {

            isEdible++
        } else if (row.class === "p" && decisionTree.predict(row) === "p") {

            goodPoison++
        } else if (row.class === "e" && decisionTree.predict(row) === "e") {

            goodEdible++
        }
    }

    let tableGoodEdible = document.getElementById("isEdible")
    tableGoodEdible.innerHTML = goodEdible.toString();

    let tableBadEdible = document.getElementById("isNotEdible")
    tableBadEdible.innerHTML = isEdible.toString();

    let tableGoodPoison = document.getElementById("isPoison")
    tableGoodPoison.innerHTML = isPoison.toString();

    let tableBadPoison = document.getElementById("isNotPoison")
    tableBadPoison.innerHTML = goodPoison.toString();

    let json = decisionTree.toJSON()
    let jsonString = JSON.stringify(json)
    console.log(jsonString)

}


loadData()