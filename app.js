const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

///////////////////////////Requests Targetting All Articles/////////////////////////
app.route("/articles")

//Get All Articles
.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

//creates one new article
.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("successfully added a new article");
        } else{
            res.send(err);
        }
    });
})

//Get All Articles
.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles.")
        } else{
            res.send(err);
        }
    });
});

///////////////////////////Requests Targetting A Specific Article/////////////////////////
app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found.");
        }
    });
})

//PUT a specific article
.put(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("successfully updated article.");
            }
        }
    );
})

//PATCH a specific article
.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("successfully updated article.");
            } else {
                res.send(err);
            }
        }

    );
})

//Delete a specific article
.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted the corresponding article.");
            } else {
                res.send(err);
            }
        }

    );
});


app.listen(3000, function(){
    console.log("server started on port 3000.")
});