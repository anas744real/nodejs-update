const shortid = require('shortid');
const ShortLink = require('../models/ShortenLink');
const request = require('request');
const path = require('path');
const url = require('url');
const JSZip = require("jszip");
const ShortenLink = {
  async shortenUrl(req, res, next) {
    try {
      let newUrl = []
      const response = [...res.locals]

      response.forEach(item => {

        const awsUrl = item.awsUrl;
        const fileName = item.originalName;
        const shortUrlParam = shortid.generate();
        const createShortUrl = new ShortLink({
          awsUrl,
          shortUrlParam,
          fileName,
          // shortUrl: `https://x-shareserver.herokuapp.com/${shortUrlParam}`
          shortUrl: `http://xshare.gq/${shortUrlParam}`
          //shortUrl: `http://localhost:4000/${shortUrlParam}`
        });
        createShortUrl.save();

        let url = {
          message: 'Link shortened successfully',
          shortCode: shortUrlParam,
          shortUrl: createShortUrl.shortUrl,
          longUrl: awsUrl
        }

        newUrl.push(url)
      })

      res.json({
        success: true,
        data: newUrl
      });

    } catch (error) {
      res.json({
        success: true,
        message: error.message
      });
    }
  },
  async folderUrl(req, res, next) {
    try {
      let newUrl = []
      const response = [...res.locals]

      response.forEach(item => {

        const awsUrl = item.awsUrl;
        const fileName = item.originalName;
        const shortUrlParam = shortid.generate();
        const createShortUrl = new ShortLink({
          awsUrl,
          shortUrlParam,
          fileName,
          // shortUrl: `https://x-shareserver.herokuapp.com/${shortUrlParam}`
          shortUrl: `http://xshare.gq/${shortUrlParam}`
          //shortUrl: `http://localhost:3500/${shortUrlParam}`
        });
        createShortUrl.save();

        let url = {
          message: 'Link shortened successfully',
          shortCode: shortUrlParam,
          shortUrl: createShortUrl.shortUrl,
          longUrl: awsUrl
        }

        newUrl.push(url)
      })

      res.json({
        success: true,
        data: newUrl
      });

    } catch (error) {
      res.json({
        success: true,
        message: error.message
      });
    }
  },
  async redirectShortenUrl(req, res) {
    try {

      const response = [res.locals]
      //console.log(response[0].downloadCount)
      var currentCount = response[0].downloadCount
      var shortUrlParam = response[0].shortUrlParam
      const newCount = currentCount + 1
      //console.log(newCount)
      const data = {
        downloadCount: newCount
      }
      await ShortLink.findOneAndUpdate({ shortUrlParam }, data, (err) => {
        if (err) {
          console.log(err)
        }
      })
      response.forEach(link => {
        res.redirect(link.awsUrl)
      })
     
    } catch (error) {
      res.json({
        success: true,
        message: error.message
      });
    }
  },
  async downloadShortenUrl(req, res) {
    console.log(res.locals)
    try {

      const response = [... res.locals]
      response.forEach(link => {
        let file = link.originalName;
        let awsUrl = link.awsUrl;
        res.setHeader('Content-Disposition', `attachment; filename=${file}`);
        request(awsUrl)
          .once('data', data => {
            console.log(data);
          })
          .on('error', err => {
            console.log(err);
          })
          .pipe(res);

      })

    } catch (error) {
      res.json({
        success: true,
        message: error.message
      });
    }
  }
};

module.exports = ShortenLink;
