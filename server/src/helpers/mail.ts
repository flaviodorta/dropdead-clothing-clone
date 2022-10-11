interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export const mailConfig = {
  driver: process.env.MAIL_DRIVER || 'ethreal',
  defaults: {
    from: {
      email: 'dorta.dev@gmail.com',
      name: 'Flávio Dorta',
    },
  },
} as IMailConfig;
