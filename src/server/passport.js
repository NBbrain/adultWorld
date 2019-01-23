import passport from 'passport'; // 验证请求
import {FacebookStrategy} from 'passport-facebook'; // facebook帐户与oauth 2.0令牌对用户进行验证
// 登录策略
passport.use(
  new FacebookStrategy({
    // clientID:,
    // clientSecret:
    // callbackURL:
    profileFileds: [],
    passReqToCallback: true,
  }),
  (req, accessToken, refreshToken, profile, done)=>{

  }
)
