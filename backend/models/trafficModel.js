module.exports = (sequelize, DataTypes) => {
  const TrafficChannel = sequelize.define('TrafficChannel', {
      fb_pixel_id: {
          type: DataTypes.STRING,
          allowNull: false
      },
      fb_conversion_token: {
          type: DataTypes.STRING,
          allowNull: false
      }
  });

  return TrafficChannel;
};
