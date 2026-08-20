const serveBin = process.env.SERVE_BIN;

if (!serveBin) {
  throw new Error('SERVE_BIN must point to the globally installed serve executable.');
}

module.exports = {
  apps: [
    {
      name: 'tech-affairs-static',
      script: serveBin,
      args: '-s . -l 8007 --no-clipboard',
      cwd: '/home/tech_sac_admin/tech-affairs-iiitdm/out',
      interpreter: 'none',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      time: true,
    },
  ],
};
