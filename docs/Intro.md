
# Intro

Livemap helps you keep in touch while you're in remote regions by allowing you to post your updates to an online map which followers can keep track of. It basically turns your satphone into a simple InReach or Spot device without the need to carry an extra piece of equipment which you need to keep charged in the field.

If you're tight on weight and/or power, livemap can be a very simple solution.

I've provided a rough outline below of what you'll need to do to get things set up. If you are interested in using this system without the hassle of setting it up, please drop me an email. I'm happy to deploy and maintain the system for you for a small fee which can be arranged (I'm cheaper than an InReach or Spot ;) ).

### What you'll need:

- a satphone

...that's it really! You'll have to deploy and test the system before you go, but all the tools you'll need are free of charge.

### Overview

To make everything free, the system is somewhat convoluted, but works very simply and is almost instantaneously once it's set up. Here's a quick overview of how it works:

1. Send a message to twitter from your satphone using a prescribed format. The message will contain the latitude and longitude of your location, the message text and a single letter code to select the icon which will be displayed on the map (optional).

2. The message is received by twitter and posted on your twitter account, either as a direct message or as an actual tweet depending on how you choose to set things up.

3. A node.js application running on a cloud-based server scrapes the tweets (or DMs) from twitter, parses the text and uses the google maps API to display them to your followers on a online map.

Just give people a link to your map, or embed it in your website, and you can update them as and when you want, easy!

### Create a new twitter account

First things first, you're probably going to want a new twitter account so you aren't tweeting nonsense from your main account. That's easy, just head over to twitter and make one.

(PRO TIP: Twitter only allows one account per email address, but if you use gmail you can add a dot anywhere in the address and twitter will think it's a different email address. For example, user.name@gmail.com is the same as username@gmail.com.)

### Get your API keys from twitter

Twitter recently made this a lot more complicated than it used to be, and nowadays you have to apply for a developer account before you can do this (of course if you already have this you can skip this step).

Head over to developer.twitter.com and click on apply (make sure you're logged in with the account you want to use)

Twitter has recently made it's policy for developers more stringent, so you will have
to write a short
