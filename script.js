import plugin from './nlpPlugin.js';
import conv from './conv.js'
nlp.plugin(plugin)
document.getElementById("btn").addEventListener("click", myFunction);

function myFunction(){
  var text = nlp(document.getElementById('enter').value) //Will be the inner HTML text
  var sentences = text.sentences().data('array')
  for (let i=0; i < sentences.length; i++){
    if (nlp(sentences[i].normal).match('#Value a? (cup|cups) * #Noun').found){
      let terms = nlp(sentences[i].normal).terms().data()
      for (let j=0; j < terms.length; j++){
        if (terms[j].tags.includes("Value")){
          if (terms[j+1].normal.toLowerCase() === "cup" || terms[j+1].normal.toLowerCase() === "cups"){
            var value = parseInt(terms[j].normal, 10)
            var unit = (value > 1) ? "cups" : "cup"
          }
        }
      //Get Ingredient and equivalent in grams
        if (terms[j].tags.includes("metricFoodItem")){
          var ingredient = terms[j].normal
          var check = ""
          if (terms[j].tags.includes("metricPrefixItem")){
            var check = (Object.keys(conv[ingredient]).includes(terms[j-1].normal)) ? terms[j-1].normal : "default"
          }else if (terms[j].tags.includes("metricSuffixItem") && terms.length > j){
            var check = (Object.keys(conv[ingredient]).includes(terms[j+1].normal)) ? terms[j+1].normal : "default"
          }
          if (check === "default"){
            var inGrams = conv[ingredient].default * value
          }else if (check !== "" && check !== "default"){
            for (let type in conv[ingredient]){
              if (check.includes(type)){
                var inGrams = conv[ingredient][type] * value
              }
            }
          }

        }
      }
      console.log("Value: ",value)
      console.log("Unit: ",unit)
      console.log("Ingredient: ", ingredient);
      console.log("In Grams: ", inGrams+"g")
      if (typeof inGrams === "undefined"){
        document.getElementById("text").innerText = "Error!"
      }else{
        document.getElementById("text").innerText = inGrams + "g"
      }
    }else{
      console.log('Error! Not a nice sentence')
      document.getElementById("text").innerText = "Error!"
    }
  }
}

//Itterate throuhg terms untill first noun is found
// Check if its in the 'oneCupToGrams' object
//If it is get the value and replace a new calculated amount
//Change cup/cups to grams
//If the value is = 1 then unpluralise grams

//For each sentence
//Edit the sentence if needed then replace
//Move onto next sentence
