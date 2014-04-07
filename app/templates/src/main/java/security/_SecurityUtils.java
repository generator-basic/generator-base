package <%= groupArtifactName %>.<%=packageAppName%>.security;

import <%= groupArtifactName %>.<%=packageAppName%>.domain.UserBean;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

/**
 * Utility class for Spring Security.
 */
public final class SecurityUtils {

    private SecurityUtils() {
    }

    /**
     * Get the login of the current user.
     * @return User connected
     */
    public static UserBean getCurrentLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        UserDetails springSecurityUser =
                (UserDetails) securityContext
                        .getAuthentication().getPrincipal();
        UserBean user = new UserBean();
        user.setLogin(springSecurityUser.getUsername());
        return user;
    }
}
