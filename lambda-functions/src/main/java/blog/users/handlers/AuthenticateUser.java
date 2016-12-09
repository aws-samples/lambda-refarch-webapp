package blog.users.handlers;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import blog.configuration.ApplicationConfiguration;
import blog.configuration.ApplicationConfigurationStore;
import blog.users.models.User;
import blog.users.repositories.DynamoDBUserRepository;

public class AuthenticateUser implements RequestStreamHandler {

    private ApplicationConfigurationStore applicationConfigurationStore = new ApplicationConfigurationStore();

    @Override
    public void handleRequest(InputStream inputStream, OutputStream outputStream, Context context) throws IOException {
        LambdaLogger logger = context.getLogger();
        ObjectMapper mapper = new ObjectMapper();
        User user = mapper.readValue(inputStream, User.class);
        logger.log("Verifying User:\n" + user + "\n");

        ApplicationConfiguration applicationConfiguration = applicationConfigurationStore
                .getApplicationConfiguration(user.getRequestConfiguration());
        logger.log("applicationConfiguration:\n" + applicationConfiguration + "\n");

        DynamoDBUserRepository userRepo = new DynamoDBUserRepository(applicationConfiguration);
        User verifiedUser = userRepo.verify(user);
        logger.log("Verified User:\n" + verifiedUser + "\n");

        mapper.writeValue(outputStream, verifiedUser);
    }
}