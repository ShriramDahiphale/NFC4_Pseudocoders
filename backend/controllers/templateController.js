import Template from '../models/Template.js';

export const getTemplates = async (req, res) => {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
};

export const getTemplateById = async (req, res) => {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
};
