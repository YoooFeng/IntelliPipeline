// package com.iscas.yf.IntelliPipeline.deprecated;
//
// import com.iscas.yf.IntelliPipeline.service.user.LoginCommand;
// import com.iscas.yf.IntelliPipeline.service.user.LoginValidator;
// import org.apache.shiro.SecurityUtils;
// import org.apache.shiro.authc.AuthenticationException;
// import org.apache.shiro.authc.UsernamePasswordToken;
// import org.springframework.stereotype.Controller;
// import org.springframework.validation.BindingResult;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestMethod;
// import org.springframework.web.bind.annotation.ResponseBody;
// import org.springframework.web.servlet.ModelAndView;
//
// import java.util.Map;
//
// @Deprecated
// @Controller
// public class SecurityController {
//
//     private LoginValidator loginValidator = new LoginValidator();
//
//     @RequestMapping(value = "/login", method = RequestMethod.POST)
//     public String login(LoginCommand command, BindingResult errors) {
//
//         loginValidator.validate(command, errors);
//
//         // 如果没有登录成功, 直接返回登录页面
//         if(errors.hasErrors()) {
//             return "/login";
//         }
//
//         UsernamePasswordToken token = new UsernamePasswordToken(command.getUsername(),
//                 command.getPassword(), command.isRememberMe());
//
//         try {
//             SecurityUtils.getSubject().login(token);
//         } catch (AuthenticationException e) {
//             errors.reject("error.login.generic", "无效的用户名或密码, 请重新输入!");
//         }
//
//         if( errors.hasErrors()) {
//             return "/login";
//         } else {
//             return "redirect:/project/main";
//         }
//
//     }
//
//     @RequestMapping("/logout")
//     public String logout() {
//         SecurityUtils.getSubject().logout();
//
//         // 返回首页, 目前是登录页面, 后期可进行改进
//         return "redirect:/";
//     }
//
//
// }