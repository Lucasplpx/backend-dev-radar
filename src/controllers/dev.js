const api = require('../services/api');
const Dev = require('../models/dev');

const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');
module.exports = {

    async index (req, res) {        

        try {
            const devs = await Dev.find();

            return res.json(devs);
        } catch (error) {
            return res.status(404).json({ data: 'Erro API' });
        }

    },

    async store(req, res) {

        const { github_username, techs, latitude, longitude } = req.body;

        try {

            const resp = await api.get(`/users/${github_username}`);
            
            let dev = await Dev.findOne({ github_username })

            if (dev) return res.status(401).json({ info: `User (${dev.name}) já cadastrado!`, id: dev._id })

            const { name , login , avatar_url, bio } = resp.data
            
            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                github_username,
                name: name || login,
                avatar_url,
                bio: bio || 'User does not have bio',
                techs: techsArray,
                location
            });

            // Filtrar as conexões que estão há no máximo 10km de distância
            // e que o novo dev tenha pleo menos uma das tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);

            return res.json(dev);

        } catch (error) {
            return res.status(404).json({ data: 'Erro API' });
        }
    }

}