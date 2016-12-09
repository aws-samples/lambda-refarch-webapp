package blog.comments.handlers;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestStreamHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import blog.comments.models.Comment;
import blog.comments.repositories.DynamoDBCommentRepository;
import blog.configuration.ApplicationConfiguration;
import blog.configuration.ApplicationConfigurationStore;

public class SaveComment implements RequestStreamHandler {

    private ApplicationConfigurationStore applicationConfigurationStore = new ApplicationConfigurationStore();

    @Override
    public void handleRequest(InputStream input, OutputStream output, Context context) throws IOException {
        LambdaLogger logger = context.getLogger();
        ObjectMapper mapper = new ObjectMapper();
        Comment comment = mapper.readValue(input, Comment.class);
        logger.log("comment:\n" + comment + "\n");

        ApplicationConfiguration applicationConfiguration = applicationConfigurationStore
                .getApplicationConfiguration(comment.getRequestConfiguration());
        logger.log("applicationConfiguration:\n" + applicationConfiguration + "\n");

        DynamoDBCommentRepository commentRepo = new DynamoDBCommentRepository(applicationConfiguration);
        Comment savedComment = commentRepo.saveComment(comment);
        logger.log("savedComment:\n" + savedComment + "\n");

        mapper.writeValue(output, savedComment);
    }
}