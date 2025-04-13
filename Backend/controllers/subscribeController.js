import Subscriber from '../models/subscribeModel.js';

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(200).json({ success: true, message: 'Email already subscribed.', subscribed: true }); // Return 'subscribed: true'
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.status(201).json({ success: true, message: 'Subscribed successfully!', subscribed: false }); // Return 'subscribed: false'
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};