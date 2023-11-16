import { User, userMention, bold } from "discord.js";

type Answer = {
  user: User;
  points: number;
};

type RoundResults = {
  question: string;
  answers: Answer[];
  averageStorypoints: number;
  usersWhoDidntAnswer: User[];
};

type AnswerResponse = {
  message: string;
};

export class Poker {
  static readonly ANSWERS = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100];

  currentAnswers: Answer[];
  currentQuestion: string;
  users: User[];

  constructor(question: string, users: User[]) {
    this.currentQuestion = question;
    this.currentAnswers = [];
    this.users = users;
  }

  addAnswer(user: User, points: number): AnswerResponse {
    // Update answer if user already answered
    const existingAnswer = this.currentAnswers.find(
      (answer) => answer.user.id === user.id
    );

    if (existingAnswer) {
      existingAnswer.points = points;
      return {
        message: `Du hast deine zuvor gespielte Karte durch '${points}' ersetzt!`,
      };
    }

    // Add answer if user didn't answer yet
    this.currentAnswers.push({ user, points });

    return {
      message: `Du hast die Karte '${points}' gespielt!`,
    };
  }

  // Check if all users have answered
  // If so, finish the question and return the game summary
  checkIfAllUsersHaveAnswered(): string | null {
    if (this.currentAnswers.length === this.users.length) {
      const roundResults = this.finishRound();
      return this.getSummary(roundResults);
    }

    return null;
  }

  cancelQuestion(userWhoCanceled: User): string {
    const roundResults = this.finishRound();
    return this.getSummary(roundResults, userWhoCanceled);
  }

  finishRound(): RoundResults {
    const totalStorypoints = this.currentAnswers.reduce(
      (acc, answer) => acc + answer.points,
      0
    );

    const averageStorypoints = totalStorypoints / this.currentAnswers.length;

    const usersWhoDidntAnswer = this.users.filter(
      (user) =>
        !this.currentAnswers.find((answer) => answer.user.id === user.id)
    );

    const roundResults = {
      question: this.currentQuestion,
      answers: this.currentAnswers,
      averageStorypoints,
      usersWhoDidntAnswer,
    };

    this.currentQuestion = "";
    this.currentAnswers = [];
    this.users = [];

    return roundResults;
  }

  getSummary(roundResults: RoundResults, userWhoCanceled?: User): string {
    const title = userWhoCanceled
      ? `Runde durch ${userMention(userWhoCanceled.id)} ${
          roundResults.answers.length === 0 ? "abgebrochen" : "beendet"
        }!`
      : "Die Runde ist vorbei!";

    // If no one answered, only show the title
    if (roundResults.answers.length === 0) return bold(title);

    // Build list of answers
    const answersList: string[] = [];
    roundResults.answers.forEach((answer) => {
      answersList.push(
        `- ${userMention(answer.user.id)}: ${answer.points.toString()}`
      );
    });

    roundResults.usersWhoDidntAnswer.forEach((user) => {
      answersList.push(`- ${userMention(user.id)}: [-]`);
    });

    // Build detailed summary
    const content = [
      bold(title),
      `Task: ${roundResults.question}`,
      "",
      `Antworten:`,
      ...answersList,
      "",
      `Durchschnitt: ${roundResults.averageStorypoints.toFixed(2)} ${
        roundResults.averageStorypoints == 1 ? "Stunde" : "Stunden"
      }`,
    ];

    return content.join("\n");
  }
}
