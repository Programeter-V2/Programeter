const sequelize = require('../config/connection');
const { User, Question, Option, Language, UserAnswer, LanguageLink } = require('../models');

const userData = require('./userData.json');
const questionData = require('./QuestionData.json');
const optionData = require('./optionsData.json');
const languageData = require('./languageData.json');

const seedDatabase = async () => {
  let users;
  let questions;
  let options;
  let languages;

  await sequelize.sync();

  users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
 
  questions = await Question.bulkCreate(questionData, {
    individualHooks: true,
    returning: true,
  });
  
  options = await Option.bulkCreate(optionData, {
    individualHooks: true,
    returning: true,
  });
  
  languages = await Language.bulkCreate(languageData, {
    individualHooks: true,
    returning: true,
  });

  // generate random answers and languages for each user
  for (const user of users) {
    // generate random answers for each question
    for (const question of questions) { 
      const options = await Option.findAll({
        where: {
          question_id: question.id
        }
      });
      await UserAnswer.create({
        user_id: user.id,
        answer_id: options[Math.floor(Math.random()*options.length)].id
      });
    }

    // give each user three random languages
    for (let i = 1; i <= 3; i++) {
      await LanguageLink.create({
        user_id: user.id,
        language_id: languages[Math.floor(Math.random() * languages.length)].id
      });
    }
  }
  
  process.exit(0);

};

seedDatabase();
