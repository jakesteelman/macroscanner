# Macroscanner 📷🍏

Macroscanner is an LLM-powered food macronutrient prediction tool. It uses GPT-4o to predict the food items and quantities from multiple photos in a JSON format, then searches these in a vector-enabled copy of the [USDA's Food Data Central](https://fdc.nal.usda.gov/download-datasets) database, which is a publicly available dataset, to get macronutrient information for each item.

I originally intended for Macroscanner to be a digital product, but I've determined the idea is not viable enough for me to pursue it, so I've open sourced my work up on the Mininum Viable Product (MVP).

## Background

Calorie tracking is something I try to do every day so I constantly have a pulse on my health and can ensure I'm on target with my fitness goals. However, tracking meals or snacks during or after consumption them can sometimes be inconvenient, impolite, or distracting, but after consuming a meal or a snack, it's sometimes hard to remember what you ate, and your ability to estimate quantities accurately diminishes with each passing hour. 

To mitigate this, I've resulted to just snapping a quick photo of what I eat anytime I don't want to track it in the app right then. Before bed at the end of the day (or when I wake up the next day) I'll try to estimate my intake based on the photos in my camera roll and log it retrospectively in my favorite nutrition tracker, MacroFactor. 

Something I've noticed over the past 6-8 months of doing this is that I often go long stretches (2-3 days even) where I'm not logging anything or checking the app at all. This isn't what I want, as I'm eating based on mental notes of what I've already had that day, thus making it harder to stick to my goal. Sometimes, I'd go back and notice I went way over or under on my targets.

## My idea

What if there was a way to get the macronutrients just from taking a photo (or photos) of your food? The app could detect the type of ingredients present in the photos, and estimate the mass or volume of each ingredient present. You'd snap a picture, and have a running tally of the nutrition from what you ate on any given day. It wouldn't be a full blown nutrition tracking app - you'd just use it as a utility to help you track nutrition more efficiently.

I went ahead and built everything out for a minimum viable product, which is what you see in this repo. It uses the following tech stack:

- **Frontend**: [Next.js 15](https://github.com/vercel/next.js), using [this template](https://github.com/vercel/next.js/tree/canary/examples/with-supabase).
- **Backend**: [Supabase](https://github.com/supabase/supabase)
- **Payments**: [Stripe](https://www.stripe.com)
- **AI**: [OpenAI API](https://platform.openai.com), GPT-4o

### Why did I use an LLM for the backend?

I used a vision-enabled LLM as the primary "intelligence" of the app because, just in my testing, they generalize fairly well for the task of categorizing food and have minimal effort to get up to speed with. 

Had I trained my own model (which I considered doing) it 1. would have taken a long time to gather data, train, test, and refine it to be good enough for production use, and 2. the resulting model could be biased toward a predominant genre or culture of food, or not generalize as well. 

An LLM is probably not the best quantity estimation model. Perhaps, to achieve SOTA results, you'd need some sort of depth estimation model and a segmentation model. Generate a depth map of the scene, get a segmentation mask for a food item, apply that item's segmentation mask to the depth map to get a depth map of the food item, generate a point cloud, compute its volume, multiply the volume of the point cloud by a known density of that food to get the mass of the food. 

I decided against this approach for quantity estimation and just deferred to the LLM. I would likely be chasing only marginal gains for exponentially more time invested, and that proposed quantity estimator is very likely heavily flawed. Also, since each step of that process has some error rate, the overall error rate of the system vastly increases as you move through it.

## Why I abandoned it

For starters, I made the cardinal startup mistake of not evaluating the market before investing time and resources into building a product. 

After I finished the MVP, I found out that MyFitnessPal (the biggest nutrition tracking app) already has this functionality integrated directly into their food tracker app. Lifesum also has a similar feature. Additionally, I neglected to do any other research to see if this was a problem other people experienced, or if it was just me.

Even if you assume this is a real problem that people face, since a photo journaling feature is "low hanging fruit" for other nutrition tracking apps to implement (it's a prompt and a model with minimal orchestration) I figured it wouldn't be long before nutrition trackers apps comprising 80-90% of the market share had some variation of photo journaling functionality. 

As a solopreneur, my moat right out of the gate would have been extremely narrow. You'd still have to purchase Macroscanner _in addition to_ another nutrition tracker. I had essentially developed a feature, not a product. And, with consumers already inundated with subscription services, it looked like marketing this thing was a losing battle.

It didn't look cost effective either. I estimated my variable costs to be ~20-30¢ per image. At my usage level (likely higher than most), I'd have to price it at $6 per month just to make a 50% gross profit. I didn't want to mess with hosting directly on AWS or self-hosting Supabase, so the steep Vercel and Supabase pricing at scale worried me, especially with a 50% gross profit to cover that.

## Lessons learned

1. Research the market before starting to build a product. A few competitors is fine, but make sure there's actually a need for the product.
2. Start with a product and build features, not the other way around. Feature ≠ Product.
3. Simplicity is better at first (LLMs vs custom deep learning & computer vision models).

## Conclusion

I decided to open source the project to demonstrate an example of how I can solve a unique problem (even if it isn't a real problem) by utilizing data and AI. Perhaps this repository will inspire someone else to create something similar, or inspire a different use case or architecture in their own application. 

On to the next one!

© 2025 Jake Steelman
