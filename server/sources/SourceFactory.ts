import { LinkedIn, LinkedInOptions } from "./Linkedin";
import { LinkedInPost } from "./LinkedInPost";
import { SourceBase } from "./SourceBase";

export enum SourceType {
  LinkedIn = 'LinkedIn',
  LinkedInPost = 'LinkedInPost',
};


// interface SourceFactoryOptions {

// }

// TODO: maybe this should hard coded types that are accepted. I need to figure out a common patterns that each source would share for options
export type SourceFactoryOptions = { [option: string]: unknown; };

// store in memory so we wont have to create another class
// const sources: {[s: string]: SourceBase } = {}

export class SourceFactory {
  static createSource(type: SourceType, options?: SourceFactoryOptions): SourceBase {
    switch (type) {
      case SourceType.LinkedIn:
        if (LinkedIn.isType<LinkedInOptions>(options)) {
          return new LinkedIn({ ...options });
        } else {
          throw new Error(`Invalid options for ${type}`);
        }
      case SourceType.LinkedInPost:
        // TODO: options need to be passed down
        return new LinkedInPost(options || {});
      default:
        throw new Error(`${type} - not yet implemented`);
    }
  }
}
